import { useEffect, useState } from "react"
import { listarLeiturasDispositivo } from "@/features/dispositivos/model/dispositivo.service"
import type { LeituraDispositivo } from "@/features/dispositivos/model/dispositivo.types"
import { getApiErrorMessage } from "@/services/api"

const POR_PAGINA_PADRAO = 20

export function useDispositivoLeituras(
  dispositivoId: string | undefined,
  porPagina = POR_PAGINA_PADRAO
) {
  const [pagina, setPagina] = useState(1)
  const [leituras, setLeituras] = useState<LeituraDispositivo[]>([])
  const [total, setTotal] = useState(0)
  const [porPaginaAtual, setPorPaginaAtual] = useState(porPagina)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!dispositivoId) return

    let ativo = true
    const controller = new AbortController()

    listarLeiturasDispositivo({
      dispositivoId,
      pagina,
      porPagina,
      signal: controller.signal,
    })
      .then((resposta) => {
        if (!ativo) return
        setLeituras(resposta.leituras)
        setTotal(resposta.total)
        setPorPaginaAtual(resposta.porPagina)
        setErro(null)
      })
      .catch((error: unknown) => {
        if (!ativo || controller.signal.aborted) return
        setLeituras([])
        setTotal(0)
        setErro(
          getApiErrorMessage(
            error,
            "Não foi possível carregar as leituras. Tente novamente."
          )
        )
      })
      .finally(() => {
        if (ativo) setIsLoading(false)
      })

    return () => {
      ativo = false
      controller.abort()
    }
  }, [dispositivoId, pagina, porPagina, reloadToken])

  const totalPaginas = Math.max(1, Math.ceil(total / porPaginaAtual))
  const inicio = total === 0 ? 0 : (pagina - 1) * porPaginaAtual + 1
  const fim = Math.min(pagina * porPaginaAtual, total)

  function irParaPagina(novaPagina: number): void {
    if (novaPagina < 1 || novaPagina > totalPaginas) return
    if (novaPagina === pagina) return
    setIsLoading(true)
    setPagina(novaPagina)
  }

  function recarregar(): void {
    setIsLoading(true)
    setErro(null)
    setPagina(1)
    setReloadToken((token) => token + 1)
  }

  return {
    leituras,
    pagina,
    total,
    totalPaginas,
    inicio,
    fim,
    porPagina: porPaginaAtual,
    isLoading: dispositivoId ? isLoading : false,
    erro,
    irParaPagina,
    recarregar,
  }
}

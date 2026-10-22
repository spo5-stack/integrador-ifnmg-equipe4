import { useEffect, useState } from "react"
import { excluirGalpao, listarGalpoes } from "@/services/galpaoService"
import type { Galpao, GalpoesResposta } from "@/interfaces/galpao"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

const GALPOES_POR_PAGINA = 10

export function useGalpoes() {
  const [pagina, setPagina] = useState(1)
  const [dados, setDados] = useState<GalpoesResposta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [reloadToken, setReloadToken] = useState(0)
  const [galpaoParaExcluir, setGalpaoParaExcluir] = useState<Galpao | null>(
    null
  )
  const [isExcluindo, setIsExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)

  useEffect(() => {
    let ativo = true

    listarGalpoes({ pagina, porPagina: GALPOES_POR_PAGINA })
      .then((resposta) => {
        if (ativo) setDados(resposta)
      })
      .catch((error: unknown) => {
        if (!ativo) return

        setDados(null)
        setErro(
          getApiErrorMessage(
            error,
            "Não foi possível carregar os galpões. Tente novamente."
          )
        )
      })
      .finally(() => {
        if (ativo) setIsLoading(false)
      })

    return () => {
      ativo = false
    }
  }, [pagina, reloadToken])

  const galpoes = dados?.galpoes ?? []
  const total = dados?.total ?? 0
  const totalPaginas = Math.max(
    1,
    Math.ceil(total / (dados?.porPagina ?? GALPOES_POR_PAGINA))
  )
  const inicio = total === 0 ? 0 : (pagina - 1) * GALPOES_POR_PAGINA + 1
  const fim = Math.min(pagina * GALPOES_POR_PAGINA, total)
  const termoBusca = busca.trim().toLocaleLowerCase("pt-BR")
  const galpoesFiltrados = termoBusca
    ? galpoes.filter((galpao) =>
        galpao.nome.toLocaleLowerCase("pt-BR").includes(termoBusca)
      )
    : galpoes

  function iniciarCarregamento(): void {
    setIsLoading(true)
    setErro(null)
  }

  function recarregar(): void {
    iniciarCarregamento()
    setReloadToken((token) => token + 1)
  }

  function mudarBusca(valor: string): void {
    setBusca(valor)
  }

  function irParaPagina(novaPagina: number): void {
    if (novaPagina < 1 || novaPagina > totalPaginas) return
    if (novaPagina === pagina) return

    iniciarCarregamento()
    setBusca("")
    setPagina(novaPagina)
  }

  function solicitarExclusao(galpao: Galpao): void {
    setErroExclusao(null)
    setGalpaoParaExcluir(galpao)
  }

  function cancelarExclusao(): void {
    if (!isExcluindo) setGalpaoParaExcluir(null)
  }

  async function confirmarExclusao(): Promise<void> {
    if (!galpaoParaExcluir || isExcluindo) return

    setIsExcluindo(true)
    setErroExclusao(null)

    try {
      await excluirGalpao(galpaoParaExcluir.id)
      setGalpaoParaExcluir(null)
      setBusca("")

      if (pagina > 1 && galpoes.length === 1) {
        iniciarCarregamento()
        setPagina(pagina - 1)
      } else {
        recarregar()
      }
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)

      if (status === 409) {
        setErroExclusao(
          "Este galpão possui lotes ou dispositivos vinculados e não pode ser excluído."
        )
      } else if (status === 404) {
        setErroExclusao("Galpão não encontrado. A lista será atualizada.")
        recarregar()
      } else {
        setErroExclusao(
          getApiErrorMessage(error, "Não foi possível excluir o galpão.")
        )
      }

      setGalpaoParaExcluir(null)
    } finally {
      setIsExcluindo(false)
    }
  }

  return {
    pagina,
    galpoes,
    galpoesFiltrados,
    total,
    totalPaginas,
    inicio,
    fim,
    isLoading,
    erro,
    busca,
    temBusca: termoBusca.length > 0,
    galpaoParaExcluir,
    isExcluindo,
    erroExclusao,
    recarregar,
    mudarBusca,
    irParaPagina,
    solicitarExclusao,
    cancelarExclusao,
    confirmarExclusao,
  }
}

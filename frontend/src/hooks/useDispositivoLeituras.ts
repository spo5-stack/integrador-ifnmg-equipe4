import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getApiErrorMessage } from "@/services/api"
import { listarLeiturasDispositivo } from "@/services/dispositivoService"

const POR_PAGINA_PADRAO = 20

export function useDispositivoLeituras(
  dispositivoId: string | undefined,
  porPagina = POR_PAGINA_PADRAO
) {
  const [pagina, setPagina] = useState(1)

  const query = useQuery({
    queryKey: ["dispositivo", dispositivoId, "leituras", pagina, porPagina],
    queryFn: ({ signal }) =>
      listarLeiturasDispositivo({
        dispositivoId: dispositivoId as string,
        pagina,
        porPagina,
        signal,
      }),
    enabled: Boolean(dispositivoId),
  })

  const leituras = query.data?.leituras ?? []
  const total = query.data?.total ?? 0
  const porPaginaAtual = query.data?.porPagina ?? porPagina
  const totalPaginas = Math.max(1, Math.ceil(total / porPaginaAtual))
  const inicio = total === 0 ? 0 : (pagina - 1) * porPaginaAtual + 1
  const fim = Math.min(pagina * porPaginaAtual, total)

  const erro = query.isError
    ? getApiErrorMessage(
        query.error,
        "Não foi possível carregar as leituras. Tente novamente."
      )
    : null

  const isLoading =
    Boolean(dispositivoId) && (query.isPending || query.isFetching)

  function irParaPagina(novaPagina: number): void {
    if (novaPagina < 1 || novaPagina > totalPaginas) return
    if (novaPagina === pagina) return
    setPagina(novaPagina)
  }

  function recarregar(): void {
    setPagina(1)
    void query.refetch()
  }

  return {
    leituras,
    pagina,
    total,
    totalPaginas,
    inicio,
    fim,
    porPagina: porPaginaAtual,
    isLoading,
    erro,
    irParaPagina,
    recarregar,
  }
}

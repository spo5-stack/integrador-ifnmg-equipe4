import { useQuery } from "@tanstack/react-query"
import { REALTIME_REFRESH_INTERVAL_MS } from "@/config/realtime"
import { obterGalpao } from "@/services/galpaoService"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useGalpaoDetalhe(id: string | undefined) {
  const query = useQuery({
    queryKey: ["galpao", id],
    queryFn: ({ signal }) => obterGalpao(id as string, signal),
    enabled: Boolean(id),
    refetchInterval: REALTIME_REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })

  const status = query.isError ? getApiErrorStatus(query.error) : undefined
  const naoEncontrado = !id || status === 404 || status === 400

  const erro =
    query.isError && !naoEncontrado
      ? getApiErrorMessage(
          query.error,
          "Não foi possível carregar o galpão. Tente novamente."
        )
      : null

  const isLoading = query.isPending && !query.data

  function recarregar(): void {
    void query.refetch()
  }

  return {
    dados: query.data ?? null,
    isLoading,
    naoEncontrado,
    erro,
    recarregar,
  }
}

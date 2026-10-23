import { useQuery } from "@tanstack/react-query"
import { REALTIME_REFRESH_INTERVAL_MS } from "@/config/realtime"
import { getApiErrorMessage } from "@/services/api"
import { obterStatusGalpao } from "@/services/galpaoService"

export function useGalpaoStatus(id: string | undefined) {
  const query = useQuery({
    queryKey: ["galpao", id, "status"],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("galpaoId inválido")
      return obterStatusGalpao(id, signal)
    },
    enabled: Boolean(id),
    refetchInterval: REALTIME_REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })

  return {
    status: query.data ?? null,
    isLoading: query.isPending && !query.data,
    erro: query.isError
      ? getApiErrorMessage(
          query.error,
          "Não foi possível carregar o status do galpão."
        )
      : null,
    recarregar: () => void query.refetch(),
  }
}

import { useQuery } from "@tanstack/react-query"
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
    staleTime: 60_000,
  })

  return {
    status: query.data ?? null,
    isLoading: query.isPending,
    erro: query.isError
      ? getApiErrorMessage(
          query.error,
          "Não foi possível carregar o status do galpão."
        )
      : null,
    recarregar: () => void query.refetch(),
  }
}

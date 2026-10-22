import { useQuery } from "@tanstack/react-query"
import type { DashboardResumo } from "@/interfaces/dashboard"
import type { Galpao } from "@/interfaces/galpao"
import { getApiErrorMessage } from "@/services/api"
import { obterDashboard } from "@/services/dashboardService"
import { listarGalpoes } from "@/services/galpaoService"

const GALPOES_NO_RESUMO = 5

type ResumoGalpoes = {
  indicadores: DashboardResumo
  galpoesRecentes: Galpao[]
}

async function carregarResumo(signal: AbortSignal): Promise<ResumoGalpoes> {
  const [indicadores, listaGalpoes] = await Promise.all([
    obterDashboard(signal),
    listarGalpoes({ pagina: 1, porPagina: GALPOES_NO_RESUMO }),
  ])

  return { indicadores, galpoesRecentes: listaGalpoes.galpoes }
}

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: ({ signal }) => carregarResumo(signal),
  })

  const dados: DashboardResumo | null = query.data?.indicadores ?? null
  const galpoesRecentes: Galpao[] = query.data?.galpoesRecentes ?? []

  const erro = query.isError
    ? getApiErrorMessage(
        query.error,
        "Não foi possível carregar o dashboard. Tente novamente."
      )
    : null

  const isLoading = query.isPending || query.isFetching

  function recarregar(): void {
    void query.refetch()
  }

  return {
    dados,
    galpoesRecentes,
    isLoading,
    erro,
    recarregar,
  }
}

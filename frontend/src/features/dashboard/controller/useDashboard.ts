import { useEffect, useState } from "react"
import { obterDashboard } from "@/features/dashboard/model/dashboard.service"
import type { DashboardResumo } from "@/features/dashboard/model/dashboard.types"
import { listarGalpoes } from "@/features/galpoes/model/galpao.service"
import type { Galpao } from "@/features/galpoes/model/galpao.types"
import { getApiErrorMessage } from "@/services/api"

const GALPOES_NO_RESUMO = 5

export function useDashboard() {
  const [dados, setDados] = useState<DashboardResumo | null>(null)
  const [galpoesRecentes, setGalpoesRecentes] = useState<Galpao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let ativo = true

    Promise.all([
      obterDashboard(),
      listarGalpoes({ pagina: 1, porPagina: GALPOES_NO_RESUMO }),
    ])
      .then(([dashboard, galpoes]) => {
        if (!ativo) return

        setDados(dashboard)
        setGalpoesRecentes(galpoes.galpoes)
      })
      .catch((error: unknown) => {
        if (!ativo) return

        setDados(null)
        setGalpoesRecentes([])
        setErro(
          getApiErrorMessage(
            error,
            "Não foi possível carregar o dashboard. Tente novamente."
          )
        )
      })
      .finally(() => {
        if (ativo) setIsLoading(false)
      })

    return () => {
      ativo = false
    }
  }, [reloadToken])

  function recarregar(): void {
    setIsLoading(true)
    setErro(null)
    setReloadToken((token) => token + 1)
  }

  return { dados, galpoesRecentes, isLoading, erro, recarregar }
}

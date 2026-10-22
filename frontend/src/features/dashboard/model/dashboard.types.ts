import type { Galpao } from "@/features/galpoes/model/galpao.types"

export type DashboardResumo = {
  totalGalpoes: number
  totalLotesAtivos: number
  totalDispositivos: number
  totalAdequados: number
  galpoes: Galpao[]
}

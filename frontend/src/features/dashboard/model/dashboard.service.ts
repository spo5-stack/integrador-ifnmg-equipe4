import { api } from "@/services/api"
import type { DashboardResumo } from "@/features/dashboard/model/dashboard.types"

export async function obterDashboard(): Promise<DashboardResumo> {
  const { data } = await api.get<DashboardResumo>("/api/dashboard")
  return data
}

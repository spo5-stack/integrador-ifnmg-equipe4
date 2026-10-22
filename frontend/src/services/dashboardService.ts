import type { DashboardResumo } from "@/interfaces/dashboard"
import { api } from "@/services/api"

export async function obterDashboard(
  signal?: AbortSignal
): Promise<DashboardResumo> {
  const { data } = await api.get<DashboardResumo>("/api/dashboard", { signal })
  return data
}

import { api } from "@/services/api"
import type { CriarLoteDados, Lote } from "@/features/lotes/model/lote.types"

export async function criarLote(
  galpaoId: string,
  dados: CriarLoteDados
): Promise<Lote> {
  const { data } = await api.post<Lote>(
    `/api/galpoes/${encodeURIComponent(galpaoId)}/lotes`,
    dados
  )

  return data
}

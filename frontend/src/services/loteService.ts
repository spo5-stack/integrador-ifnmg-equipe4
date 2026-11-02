import type { CriarLoteDados, Lote } from "@/interfaces/lote"
import { api } from "@/services/api"

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

export async function encerrarLote(id: string): Promise<Lote> {
  const { data } = await api.patch<Lote>(
    `/api/lotes/${encodeURIComponent(id)}/encerrar`
  )

  return data
}

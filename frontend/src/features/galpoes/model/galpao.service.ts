import { api } from "@/services/api"
import type {
  GalpoesResposta,
  ListarGalpoesParams,
} from "@/features/galpoes/model/galpao.types"

export async function listarGalpoes({
  pagina,
  porPagina,
}: ListarGalpoesParams): Promise<GalpoesResposta> {
  const { data } = await api.get<GalpoesResposta>("/api/galpoes", {
    params: { pagina, porPagina },
  })

  return data
}

export async function excluirGalpao(id: string): Promise<void> {
  await api.delete(`/api/galpoes/${encodeURIComponent(id)}`)
}

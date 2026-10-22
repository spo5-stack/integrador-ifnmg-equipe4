import { api } from "@/services/api"
import type {
  AtualizarGalpaoDados,
  CriarGalpaoDados,
  GalpaoBase,
  GalpaoDetalhe,
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

export async function obterGalpao(id: string): Promise<GalpaoDetalhe> {
  const { data } = await api.get<GalpaoDetalhe>(
    `/api/galpoes/${encodeURIComponent(id)}`
  )

  return data
}

export async function criarGalpao(
  dados: CriarGalpaoDados
): Promise<GalpaoBase> {
  const { data } = await api.post<GalpaoBase>("/api/galpoes", dados)

  return data
}

export async function atualizarGalpao(
  id: string,
  dados: AtualizarGalpaoDados
): Promise<GalpaoBase> {
  const { data } = await api.put<GalpaoBase>(
    `/api/galpoes/${encodeURIComponent(id)}`,
    dados
  )

  return data
}

export async function excluirGalpao(id: string): Promise<void> {
  await api.delete(`/api/galpoes/${encodeURIComponent(id)}`)
}

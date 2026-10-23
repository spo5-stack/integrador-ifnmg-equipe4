import { api } from "@/services/api"
import type {
  AtualizarGalpaoDados,
  CriarGalpaoDados,
  GalpaoBase,
  GalpaoDetalhe,
  GalpaoOpcao,
  GalpaoStatusMonitoramento,
  GalpoesResposta,
  ListarGalpoesParams,
} from "@/interfaces/galpao"

const POR_PAGINA_SELECAO = 100

export async function listarGalpoes(
  { pagina, porPagina }: ListarGalpoesParams,
  signal?: AbortSignal
): Promise<GalpoesResposta> {
  const { data } = await api.get<GalpoesResposta>("/api/galpoes", {
    params: { pagina, porPagina },
    signal,
  })

  return data
}

export async function listarGalpoesParaSelecao(
  galpaoIdInicial?: string
): Promise<GalpaoOpcao[]> {
  const resposta = await listarGalpoes({
    pagina: 1,
    porPagina: POR_PAGINA_SELECAO,
  })
  const galpoes: GalpaoOpcao[] = resposta.galpoes

  if (galpaoIdInicial && !galpoes.some(({ id }) => id === galpaoIdInicial)) {
    const galpao = await obterGalpao(galpaoIdInicial)
    return [
      ...galpoes,
      {
        id: galpao.id,
        nome: galpao.nome,
        capacidade: galpao.capacidade,
      },
    ]
  }

  return galpoes
}

export async function obterGalpao(
  id: string,
  signal?: AbortSignal
): Promise<GalpaoDetalhe> {
  const { data } = await api.get<GalpaoDetalhe>(
    `/api/galpoes/${encodeURIComponent(id)}`,
    { signal }
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

export async function obterStatusGalpao(
  id: string,
  signal?: AbortSignal
): Promise<GalpaoStatusMonitoramento> {
  const { data } = await api.get<GalpaoStatusMonitoramento>(
    `/api/galpoes/${encodeURIComponent(id)}/status`,
    { signal }
  )
  return data
}

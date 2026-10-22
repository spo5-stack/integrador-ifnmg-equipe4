import { api } from "@/services/api"
import type {
  AtualizarDispositivoDados,
  CriarDispositivoDados,
  Dispositivo,
  LeiturasDispositivoResposta,
} from "@/features/dispositivos/model/dispositivo.types"

export async function criarDispositivo(
  galpaoId: string,
  dados: CriarDispositivoDados
): Promise<Dispositivo> {
  const { data } = await api.post<Dispositivo>(
    `/api/galpoes/${encodeURIComponent(galpaoId)}/dispositivos`,
    dados
  )

  return data
}

export async function listarDispositivosDoGalpao(
  galpaoId: string,
  signal?: AbortSignal
): Promise<Dispositivo[]> {
  const { data } = await api.get<Dispositivo[]>(
    `/api/galpoes/${encodeURIComponent(galpaoId)}/dispositivos`,
    { signal }
  )

  return data
}

export async function editarDispositivo(
  id: string,
  dados: AtualizarDispositivoDados
): Promise<Dispositivo> {
  const { data } = await api.put<Dispositivo>(
    `/api/dispositivos/${encodeURIComponent(id)}`,
    dados
  )

  return data
}

export async function listarLeiturasDispositivo({
  dispositivoId,
  pagina,
  porPagina,
  signal,
}: {
  dispositivoId: string
  pagina: number
  porPagina: number
  signal?: AbortSignal
}): Promise<LeiturasDispositivoResposta> {
  const { data } = await api.get<LeiturasDispositivoResposta>(
    `/api/dispositivos/${encodeURIComponent(dispositivoId)}/leituras`,
    {
      params: { pagina, porPagina },
      signal,
    }
  )

  return data
}

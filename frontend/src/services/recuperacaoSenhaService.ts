import type {
  MensagemResposta,
  RedefinirSenhaDados,
  SolicitarRecuperacaoDados,
  VerificarCodigoDados,
  VerificarCodigoResposta,
} from "@/interfaces/recuperacao-senha"
import { api } from "@/services/api"

export async function solicitarRecuperacao(
  dados: SolicitarRecuperacaoDados
): Promise<MensagemResposta> {
  const { data } = await api.post<MensagemResposta>(
    "/api/auth/forgot-password",
    dados
  )

  return data
}

export async function verificarCodigo(
  dados: VerificarCodigoDados
): Promise<VerificarCodigoResposta> {
  const { data } = await api.post<VerificarCodigoResposta>(
    "/api/auth/verify-reset-code",
    dados
  )

  return data
}

export async function redefinirSenha(
  dados: RedefinirSenhaDados
): Promise<MensagemResposta> {
  const { data } = await api.post<MensagemResposta>(
    "/api/auth/reset-password",
    dados
  )

  return data
}

export type SolicitarRecuperacaoDados = {
  email: string
}

export type VerificarCodigoDados = {
  email: string
  codigo: string
}

export type VerificarCodigoResposta = {
  resetToken: string
  expiraEm: number
}

export type RedefinirSenhaDados = {
  resetToken: string
  senha: string
}

export type MensagemResposta = {
  mensagem: string
}

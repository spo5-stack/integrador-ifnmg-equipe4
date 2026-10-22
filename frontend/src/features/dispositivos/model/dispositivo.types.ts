export type StatusRegistro = "ATIVO" | "DESATIVADO"

export type Dispositivo = {
  id: string
  nome: string
  modelo: string
  status: StatusRegistro
  galpoesId: string
  criadoEm: string
  atualizadoEm: string
}

export type CriarDispositivoDados = {
  nome: string
  modelo: string
}

export type AtualizarDispositivoDados = Partial<{
  nome: string
  modelo: string
  status: StatusRegistro
}>

export type LeituraDispositivo = {
  id: string
  valorLuminosidade: number
  criadoEm: string
}

export type LeiturasDispositivoResposta = {
  leituras: LeituraDispositivo[]
  total: number
  pagina: number
  porPagina: number
}

export type Lote = {
  id: string
  quantidade: number
  dataInicio: string
  status: string
  galpoesId: string
  criadoEm: string
  atualizadoEm: string
}

export type CriarLoteDados = {
  quantidade: number
  dataInicio: string
}

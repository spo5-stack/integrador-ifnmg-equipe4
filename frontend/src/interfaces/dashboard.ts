export type LoteResumo = {
  id: string
  quantidade: number
  dataInicio: string
  status: string
  fase: string
}

export type DispositivoStatus = {
  id: string
  nome: string
  ultimaLeitura: { valor: number; criadoEm: string } | null
  statusLuminosidade: string
}

export type GalpaoStatus = {
  galpaoId: string
  galpaoNome: string
  loteAtivo: LoteResumo | null
  dispositivos: DispositivoStatus[]
}

export type DashboardResumo = {
  totalGalpoes: number
  totalLotesAtivos: number
  totalDispositivos: number
  totalAdequados: number
  galpoes: GalpaoStatus[]
}

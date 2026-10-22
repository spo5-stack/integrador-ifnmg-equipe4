export type Galpao = {
  id: string
  nome: string
  capacidade: number
  criadoEm: string
  atualizadoEm: string
  _count: {
    lotes: number
    dispositivos: number
  }
}

export type GalpaoBase = Omit<Galpao, "_count">

export type ListarGalpoesParams = {
  pagina: number
  porPagina: number
}

export type GalpoesResposta = {
  galpoes: Galpao[]
  total: number
  pagina: number
  porPagina: number
}

export type StatusRegistro = "ATIVO" | "DESATIVADO"

export type LoteDoGalpao = {
  id: string
  quantidade: number
  dataInicio: string
  status: string
  fase: string
  criadoEm: string
  atualizadoEm: string
}

export type DispositivoDoGalpao = {
  id: string
  nome: string
  modelo: string
  status: StatusRegistro
  criadoEm: string
  atualizadoEm: string
  ultimaLeitura: { valor: number; criadoEm: string } | null
}

export type GalpaoDetalhe = GalpaoBase & {
  lotes: LoteDoGalpao[]
  dispositivos: DispositivoDoGalpao[]
}

export type CriarGalpaoDados = {
  nome: string
  capacidade: number
}

export type AtualizarGalpaoDados = Partial<CriarGalpaoDados>

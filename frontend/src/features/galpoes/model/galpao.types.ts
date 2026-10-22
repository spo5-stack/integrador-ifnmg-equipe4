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

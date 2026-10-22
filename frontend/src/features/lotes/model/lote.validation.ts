export type ErrosLote = {
  galpaoId?: string
  quantidade?: string
  dataInicio?: string
  geral?: string
}

export type CamposLote = {
  galpaoId: string
  quantidade: string
  dataInicio: string
  capacidade: number | null
}

type ResultadoValidacao =
  | { dados: null; erros: ErrosLote }
  | { dados: { quantidade: number; dataInicio: string }; erros: ErrosLote }

export function obterDataHojeLocal(): string {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, "0")
  const dia = String(agora.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

export function validarLote({
  galpaoId,
  quantidade,
  dataInicio,
  capacidade,
}: CamposLote): ResultadoValidacao {
  const erros: ErrosLote = {}

  if (!galpaoId) {
    erros.galpaoId = "Selecione o galpão."
  }

  const quantidadeNumero = Number(quantidade)
  if (
    !quantidade.trim() ||
    !Number.isFinite(quantidadeNumero) ||
    !Number.isInteger(quantidadeNumero) ||
    quantidadeNumero <= 0
  ) {
    erros.quantidade = "Informe uma quantidade inteira maior que zero."
  } else if (capacidade !== null && quantidadeNumero > capacidade) {
    erros.quantidade = `A quantidade não pode exceder a capacidade do galpão (${capacidade.toLocaleString("pt-BR")} aves).`
  }

  if (!dataInicio) {
    erros.dataInicio = "Informe a data de início."
  } else {
    const hoje = obterDataHojeLocal()
    if (dataInicio > hoje) {
      erros.dataInicio = "A data de início não pode ser futura."
    }
  }

  if (erros.galpaoId || erros.quantidade || erros.dataInicio) {
    return { dados: null, erros }
  }

  return {
    dados: {
      quantidade: quantidadeNumero,
      dataInicio: new Date(`${dataInicio}T00:00:00.000Z`).toISOString(),
    },
    erros: {},
  }
}

import type { CriarGalpaoDados } from "@/features/galpoes/model/galpao.types"

export type ErrosFormularioGalpao = {
  nome?: string
  capacidade?: string
  geral?: string
}

export type CamposGalpao = {
  nome: string
  capacidade: string
}

type ResultadoValidacao =
  | { dados: CriarGalpaoDados; erros: ErrosFormularioGalpao }
  | { dados: null; erros: ErrosFormularioGalpao }

export function validarGalpao({
  nome,
  capacidade,
}: CamposGalpao): ResultadoValidacao {
  const nomeLimpo = nome.trim()
  const capacidadeNumero = Number(capacidade)
  const erros: ErrosFormularioGalpao = {}

  if (!nomeLimpo) {
    erros.nome = "Informe o nome do galpão."
  }

  if (
    !capacidade.trim() ||
    !Number.isFinite(capacidadeNumero) ||
    !Number.isInteger(capacidadeNumero) ||
    capacidadeNumero <= 0
  ) {
    erros.capacidade = "Informe uma capacidade inteira maior que zero."
  }

  if (erros.nome || erros.capacidade) {
    return { dados: null, erros }
  }

  return {
    dados: { nome: nomeLimpo, capacidade: capacidadeNumero },
    erros: {},
  }
}

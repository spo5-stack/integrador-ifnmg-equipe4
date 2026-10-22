import type { StatusRegistro } from "@/features/dispositivos/model/dispositivo.types"

export type ErrosDispositivo = {
  galpaoId?: string
  nome?: string
  modelo?: string
  status?: string
  geral?: string
}

export type CamposDispositivo = {
  galpaoId: string
  nome: string
  modelo: string
  status?: StatusRegistro
}

type ResultadoCriacao =
  | { dados: { nome: string; modelo: string }; erros: ErrosDispositivo }
  | { dados: null; erros: ErrosDispositivo }

type ResultadoEdicao =
  | {
      dados: {
        nome: string
        modelo: string
        status: StatusRegistro
      }
      erros: ErrosDispositivo
    }
  | { dados: null; erros: ErrosDispositivo }

export function validarCriarDispositivo({
  galpaoId,
  nome,
  modelo,
}: CamposDispositivo): ResultadoCriacao {
  const erros: ErrosDispositivo = {}
  const nomeLimpo = nome.trim()
  const modeloLimpo = modelo.trim()

  if (!galpaoId) {
    erros.galpaoId = "Selecione o galpão."
  }
  if (!nomeLimpo) {
    erros.nome = "Informe o nome do dispositivo."
  }
  if (!modeloLimpo) {
    erros.modelo = "Informe o modelo do dispositivo."
  }

  if (erros.galpaoId || erros.nome || erros.modelo) {
    return { dados: null, erros }
  }

  return { dados: { nome: nomeLimpo, modelo: modeloLimpo }, erros: {} }
}

export function validarEditarDispositivo({
  nome,
  modelo,
  status,
}: CamposDispositivo): ResultadoEdicao {
  const erros: ErrosDispositivo = {}
  const nomeLimpo = nome.trim()
  const modeloLimpo = modelo.trim()

  if (!nomeLimpo) {
    erros.nome = "Informe o nome do dispositivo."
  }
  if (!modeloLimpo) {
    erros.modelo = "Informe o modelo do dispositivo."
  }
  if (status !== "ATIVO" && status !== "DESATIVADO") {
    erros.status = "Selecione o status."
  }

  if (erros.nome || erros.modelo || erros.status) {
    return { dados: null, erros }
  }

  return {
    dados: {
      nome: nomeLimpo,
      modelo: modeloLimpo,
      status: status as StatusRegistro,
    },
    erros: {},
  }
}

import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { z } from "zod"

export function obterDataHojeLocal(): string {
  return dayjs().format("YYYY-MM-DD")
}

export const loteSchema = z.object({
  galpaoId: z.string().trim().min(1, "Selecione o galpão."),
  quantidade: z
    .string()
    .trim()
    .min(1, "Informe uma quantidade inteira maior que zero.")
    .refine(
      (valor) => valor === "" || (/^\d+$/.test(valor) && Number(valor) > 0),
      "Informe uma quantidade inteira maior que zero."
    ),
  dataInicio: z
    .string()
    .trim()
    .min(1, "Informe a data de início.")
    .refine(
      (valor) => valor <= obterDataHojeLocal(),
      "A data de início não pode ser futura."
    ),
})

export type LoteFormValues = z.infer<typeof loteSchema>

export const loteResolver = zodResolver(loteSchema)

export function mensagemCapacidade(
  quantidade: string,
  capacidade: number | null
): string | null {
  if (capacidade === null) return null

  const quantidadeNumero = Number(quantidade)
  if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= capacidade) {
    return null
  }

  return `A quantidade não pode exceder a capacidade do galpão (${capacidade.toLocaleString(
    "pt-BR"
  )} aves).`
}

export function converterParaCriarLote(dados: LoteFormValues): {
  quantidade: number
  dataInicio: string
} {
  return {
    quantidade: Number(dados.quantidade),
    dataInicio: dayjs(dados.dataInicio).startOf("day").toISOString(),
  }
}

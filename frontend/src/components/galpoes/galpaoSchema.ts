import { z } from "zod"

export const galpaoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do galpão."),
  capacidade: z
    .string()
    .trim()
    .min(1, "Informe uma capacidade inteira maior que zero.")
    .refine(
      (valor) => /^\d+$/.test(valor) && Number(valor) > 0,
      "Informe uma capacidade inteira maior que zero."
    ),
})

export type GalpaoFormValues = z.infer<typeof galpaoSchema>

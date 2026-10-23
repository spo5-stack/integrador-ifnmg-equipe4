import { z } from "zod"

export const nomeSchema = z.object({
  nome: z.string().trim().min(1, "O preenchimento do nome é obrigatório."),
})

export type NomeFormValues = z.infer<typeof nomeSchema>

export const senhaSchema = z
  .object({
    senhaAntiga: z
      .string()
      .min(1, "O preenchimento da senha atual é obrigatório."),
    senhaNova: z
      .string()
      .min(1, "O preenchimento da nova senha é obrigatório.")
      .min(8, "A nova senha deve ter no mínimo 8 caracteres."),
  })
  .refine((dados) => /[A-Za-z]/.test(dados.senhaNova), {
    message: "A nova senha deve conter letras e números.",
    path: ["senhaNova"],
  })
  .refine((dados) => /\d/.test(dados.senhaNova), {
    message: "A nova senha deve conter letras e números.",
    path: ["senhaNova"],
  })
  .refine((dados) => dados.senhaNova !== dados.senhaAntiga, {
    message: "A nova senha deve ser diferente da senha atual.",
    path: ["senhaNova"],
  })

export type SenhaFormValues = z.infer<typeof senhaSchema>

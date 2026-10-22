import { z } from "zod"

const nomeSchema = z.string().trim().min(1, "Informe o nome do dispositivo.")

const modeloSchema = z
  .string()
  .trim()
  .min(1, "Informe o modelo do dispositivo.")

const galpaoIdSchema = z.string().trim().min(1, "Selecione o galpão.")

const statusSchema = z.enum(["ATIVO", "DESATIVADO"], {
  message: "Selecione o status.",
})

/**
 * Schema único do formulário. O galpão é validado nos dois modos (na edição
 * ele vem preenchido e bloqueado) e o status só é exibido/validado na edição.
 */
export const dispositivoSchema = z.object({
  galpaoId: galpaoIdSchema,
  nome: nomeSchema,
  modelo: modeloSchema,
  status: statusSchema,
})

export type DispositivoFormValues = z.infer<typeof dispositivoSchema>

export type CriarDispositivoFormValues = Omit<DispositivoFormValues, "status">

export type EditarDispositivoFormValues = DispositivoFormValues

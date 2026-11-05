import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const esqueciSenhaSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O preenchimento do e-mail é obrigatório.")
    .email("Por favor, insira um endereço de e-mail válido."),
})

export type EsqueciSenhaFormValues = z.infer<typeof esqueciSenhaSchema>

type EsqueciSenhaFormProps = {
  onSubmit: (dados: EsqueciSenhaFormValues) => void
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
}

export function EsqueciSenhaForm({
  onSubmit,
  isSubmitting,
  serverError,
  onFieldChange,
}: EsqueciSenhaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EsqueciSenhaFormValues>({
    resolver: zodResolver(esqueciSenhaSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const emailField = register("email", {
    onChange: () => onFieldChange?.(),
  })

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit((dados) => onSubmit(dados))}
    >
      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label
          className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
          htmlFor="esqueci-senha-email"
        >
          E-mail
        </Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...emailField}
            aria-describedby={
              errors.email ? "esqueci-senha-email-erro" : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-auto rounded-lg border-input bg-muted py-3 pr-4 pl-10 text-sm focus-visible:ring-2"
            id="esqueci-senha-email"
            placeholder="operador@exemplo.com"
            spellCheck={false}
            type="email"
          />
        </div>
        {errors.email ? (
          <p
            className="text-xs font-medium text-destructive"
            id="esqueci-senha-email-erro"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <Button
        aria-busy={isSubmitting}
        className="h-auto w-full rounded-lg bg-primary py-3 font-heading text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : null}
        {isSubmitting ? "Enviando..." : "Enviar código de Recuperação"}
        {isSubmitting ? null : <ArrowRight aria-hidden="true" />}
      </Button>
    </form>
  )
}

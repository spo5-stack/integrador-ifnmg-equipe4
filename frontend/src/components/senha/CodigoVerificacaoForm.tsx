import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CodigoOtpInput,
  TAMANHO_CODIGO,
} from "@/components/senha/CodigoOtpInput"

const codigoVerificacaoSchema = z.object({
  digitos: z
    .array(z.string().regex(/^\d?$/))
    .length(TAMANHO_CODIGO)
    .refine(
      (digitos) => digitos.every((digito) => digito !== ""),
      "O preenchimento do código é obrigatório."
    ),
})

export type CodigoVerificacaoFormValues = z.infer<
  typeof codigoVerificacaoSchema
>

type CodigoVerificacaoFormProps = {
  onSubmit: (codigo: string) => void
  onReenviar: () => void
  isSubmitting: boolean
  isReenviando: boolean
  serverError?: string
  avisoReenvio?: string | null
  onFieldChange?: () => void
}

export function CodigoVerificacaoForm({
  onSubmit,
  onReenviar,
  isSubmitting,
  isReenviando,
  serverError,
  avisoReenvio,
  onFieldChange,
}: CodigoVerificacaoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CodigoVerificacaoFormValues>({
    resolver: zodResolver(codigoVerificacaoSchema),
    defaultValues: { digitos: Array(TAMANHO_CODIGO).fill("") },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const mensagemCodigo = errors.digitos?.message ?? serverError
  const erroCodigoVisivel = Boolean(errors.digitos || serverError)

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit((dados) => onSubmit(dados.digitos.join("")))}
    >
      <Controller
        control={control}
        name="digitos"
        render={({ field }) => (
          <CodigoOtpInput
            ariaDescribedBy={
              erroCodigoVisivel ? "codigo-verificacao-erro" : undefined
            }
            disabled={isSubmitting}
            invalid={erroCodigoVisivel}
            onChange={(digitos) => {
              field.onChange(digitos)
              onFieldChange?.()
            }}
            value={field.value}
          />
        )}
      />

      <div className="min-h-5 text-center">
        {erroCodigoVisivel ? (
          <p
            className="text-sm font-semibold text-destructive"
            id="codigo-verificacao-erro"
            role="alert"
          >
            {mensagemCodigo}
          </p>
        ) : null}
      </div>

      <Button
        aria-busy={isSubmitting}
        className="h-auto w-full rounded-xl bg-primary py-3.5 font-heading text-base font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:bg-primary/90 active:scale-[0.98]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <Loader2
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : null}
        {isSubmitting ? "Verificando..." : "Verificar Código"}
      </Button>

      <div className="flex flex-col items-center gap-3 text-center">
        <Button
          aria-busy={isReenviando}
          className="h-auto p-0 font-semibold text-primary hover:underline"
          disabled={isReenviando || isSubmitting}
          onClick={onReenviar}
          type="button"
          variant="link"
        >
          {isReenviando ? "Reenviando..." : "Reenviar código"}
        </Button>

        {avisoReenvio ? (
          <p className="text-xs text-muted-foreground" role="status">
            {avisoReenvio}
          </p>
        ) : null}

        <Link
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto gap-1 p-0 text-muted-foreground"
          )}
          to="/login"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar para o login
        </Link>
      </div>
    </form>
  )
}

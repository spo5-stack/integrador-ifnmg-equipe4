import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  galpaoSchema,
  type GalpaoFormValues,
} from "@/components/galpoes/galpaoSchema"
import { cn } from "@/lib/utils"

type GalpaoFormProps = {
  defaultValues?: GalpaoFormValues
  submitLabel: string
  cancelHref: string
  serverError?: string
  isSubmitting: boolean
  onFieldChange?: () => void
  onSubmit: (dados: GalpaoFormValues) => void
}

export function GalpaoForm({
  defaultValues,
  submitLabel,
  cancelHref,
  serverError,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: GalpaoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GalpaoFormValues>({
    resolver: zodResolver(galpaoSchema),
    defaultValues: defaultValues ?? { nome: "", capacidade: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const nomeField = register("nome", { onChange: () => onFieldChange?.() })
  const capacidadeField = register("capacidade", {
    onChange: () => onFieldChange?.(),
  })

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit((dados) => onSubmit(dados))}
    >
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-heading text-lg font-extrabold">
          Informações do Galpão
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe o nome e a capacidade máxima em aves.
        </p>
      </div>

      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="galpao-nome">Nome do Galpão</Label>
        <Input
          {...nomeField}
          aria-describedby={errors.nome ? "galpao-nome-erro" : undefined}
          aria-invalid={Boolean(errors.nome)}
          autoComplete="off"
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="galpao-nome"
          placeholder="Ex: Galpão Norte 01"
          type="text"
        />
        {errors.nome ? (
          <p
            className="text-xs font-medium text-destructive"
            id="galpao-nome-erro"
          >
            {errors.nome.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="galpao-capacidade">Capacidade (aves)</Label>
        <Input
          {...capacidadeField}
          aria-describedby={
            errors.capacidade ? "galpao-capacidade-erro" : undefined
          }
          aria-invalid={Boolean(errors.capacidade)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="galpao-capacidade"
          inputMode="numeric"
          min="1"
          placeholder="Ex: 500"
          step="1"
          type="number"
        />
        {errors.capacidade ? (
          <p
            className="text-xs font-medium text-destructive"
            id="galpao-capacidade-erro"
          >
            {errors.capacidade.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto px-5 py-2.5"
          )}
          to={cancelHref}
        >
          Cancelar
        </Link>
        <Button
          aria-busy={isSubmitting}
          className="h-auto rounded-lg bg-primary px-6 py-2.5 font-heading text-sm font-bold text-primary-foreground"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : null}
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

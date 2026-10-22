import { useId } from "react"
import type { FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ErrosFormularioGalpao } from "@/features/galpoes/model/galpao.validation"
import { cn } from "@/lib/utils"

type GalpaoFormProps = {
  nome: string
  capacidade: string
  errors: ErrosFormularioGalpao
  isSubmitting: boolean
  submitLabel: string
  onChangeNome: (valor: string) => void
  onChangeCapacidade: (valor: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  cancelHref: string
}

export function GalpaoForm({
  nome,
  capacidade,
  errors,
  isSubmitting,
  submitLabel,
  onChangeNome,
  onChangeCapacidade,
  onSubmit,
  cancelHref,
}: GalpaoFormProps) {
  const formId = useId()
  const nomeId = `${formId}-nome`
  const capacidadeId = `${formId}-capacidade`
  const nomeErrorId = `${nomeId}-erro`
  const capacidadeErrorId = `${capacidadeId}-erro`

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}
    >
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-heading text-lg font-extrabold">
          Informações do Galpão
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe o nome e a capacidade máxima em aves.
        </p>
      </div>

      {errors.geral ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {errors.geral}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor={nomeId}>Nome do Galpão</Label>
        <Input
          aria-describedby={errors.nome ? nomeErrorId : undefined}
          aria-invalid={Boolean(errors.nome)}
          autoComplete="off"
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id={nomeId}
          name="nome"
          onChange={(event) => onChangeNome(event.target.value)}
          placeholder="Ex: Galpão Norte 01"
          required
          type="text"
          value={nome}
        />
        {errors.nome ? (
          <p className="text-xs font-medium text-destructive" id={nomeErrorId}>
            {errors.nome}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={capacidadeId}>Capacidade (aves)</Label>
        <Input
          aria-describedby={errors.capacidade ? capacidadeErrorId : undefined}
          aria-invalid={Boolean(errors.capacidade)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id={capacidadeId}
          inputMode="numeric"
          min="1"
          name="capacidade"
          onChange={(event) => onChangeCapacidade(event.target.value)}
          placeholder="Ex: 500"
          required
          step="1"
          type="number"
          value={capacidade}
        />
        {errors.capacidade ? (
          <p
            className="text-xs font-medium text-destructive"
            id={capacidadeErrorId}
          >
            {errors.capacidade}
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

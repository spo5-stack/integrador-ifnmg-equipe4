import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import {
  nomeSchema,
  type NomeFormValues,
} from "@/components/perfil/perfilSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type NomeFormProps = {
  nomeInicial: string
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
  onSubmit: (dados: NomeFormValues) => void
}

export function NomeForm({
  nomeInicial,
  isSubmitting,
  serverError,
  onFieldChange,
  onSubmit,
}: NomeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NomeFormValues>({
    resolver: zodResolver(nomeSchema),
    defaultValues: { nome: nomeInicial },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const nomeAtual = useWatch({
    control,
    name: "nome",
    defaultValue: nomeInicial,
  })
  const nomeSemAlteracao = nomeAtual.trim() === nomeInicial.trim()

  const nomeField = register("nome", { onChange: () => onFieldChange?.() })

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="font-heading text-lg font-extrabold">Alterar Nome</h2>

      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label
          className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
          htmlFor="perfil-nome"
        >
          Nome
        </Label>
        <Input
          {...nomeField}
          aria-describedby={errors.nome ? "perfil-nome-erro" : undefined}
          aria-invalid={Boolean(errors.nome)}
          autoComplete="name"
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="perfil-nome"
          placeholder="Seu nome"
          type="text"
        />
        {errors.nome ? (
          <p
            className="text-xs font-medium text-destructive"
            id="perfil-nome-erro"
          >
            {errors.nome.message}
          </p>
        ) : null}
      </div>

      <div>
        <Button
          aria-busy={isSubmitting}
          className="h-auto rounded-lg bg-primary px-6 py-2.5 font-heading text-sm font-bold text-primary-foreground"
          disabled={isSubmitting || nomeSemAlteracao}
          title={
            nomeSemAlteracao ? "Altere o nome para salvar" : "Salvar novo nome"
          }
          type="submit"
        >
          {isSubmitting ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : null}
          {isSubmitting ? "Salvando..." : "Salvar Nome"}
        </Button>
      </div>
    </form>
  )
}

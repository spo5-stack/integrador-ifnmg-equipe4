import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  senhaSchema,
  type SenhaFormValues,
} from "@/components/perfil/perfilSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SenhaFormProps = {
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
  onSubmit: (dados: SenhaFormValues) => void
}

export function SenhaForm({
  isSubmitting,
  serverError,
  onFieldChange,
  onSubmit,
}: SenhaFormProps) {
  const [mostrarSenhaAntiga, setMostrarSenhaAntiga] = useState(false)
  const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SenhaFormValues>({
    resolver: zodResolver(senhaSchema),
    defaultValues: { senhaAntiga: "", senhaNova: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const senhaAntigaField = register("senhaAntiga", {
    onChange: () => onFieldChange?.(),
  })
  const senhaNovaField = register("senhaNova", {
    onChange: () => onFieldChange?.(),
  })

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit((dados) => {
        onSubmit(dados)
        reset({ senhaAntiga: "", senhaNova: "" })
      })}
    >
      {" "}
      <h2 className="font-heading text-lg font-extrabold">Alterar Senha</h2>
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
          htmlFor="perfil-senha-antiga"
        >
          Senha Atual
        </Label>
        <div className="relative">
          <Input
            {...senhaAntigaField}
            aria-describedby={
              errors.senhaAntiga ? "perfil-senha-antiga-erro" : undefined
            }
            aria-invalid={Boolean(errors.senhaAntiga)}
            autoComplete="current-password"
            className="h-auto rounded-lg border-input bg-muted py-3 pr-12 pl-4 text-sm focus-visible:ring-2"
            id="perfil-senha-antiga"
            placeholder="••••••••"
            type={mostrarSenhaAntiga ? "text" : "password"}
          />
          <Button
            aria-label={
              mostrarSenhaAntiga ? "Ocultar senha atual" : "Mostrar senha atual"
            }
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={() => setMostrarSenhaAntiga((valor) => !valor)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {mostrarSenhaAntiga ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        {errors.senhaAntiga ? (
          <p
            className="text-xs font-medium text-destructive"
            id="perfil-senha-antiga-erro"
          >
            {errors.senhaAntiga.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
          htmlFor="perfil-senha-nova"
        >
          Nova Senha
        </Label>
        <div className="relative">
          <Input
            {...senhaNovaField}
            aria-describedby={
              errors.senhaNova ? "perfil-senha-nova-erro" : undefined
            }
            aria-invalid={Boolean(errors.senhaNova)}
            autoComplete="new-password"
            className="h-auto rounded-lg border-input bg-muted py-3 pr-12 pl-4 text-sm focus-visible:ring-2"
            id="perfil-senha-nova"
            placeholder="••••••••"
            type={mostrarSenhaNova ? "text" : "password"}
          />
          <Button
            aria-label={
              mostrarSenhaNova ? "Ocultar nova senha" : "Mostrar nova senha"
            }
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={() => setMostrarSenhaNova((valor) => !valor)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {mostrarSenhaNova ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        {errors.senhaNova ? (
          <p
            className="text-xs font-medium text-destructive"
            id="perfil-senha-nova-erro"
          >
            {errors.senhaNova.message}
          </p>
        ) : null}
      </div>
      <div>
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
          {isSubmitting ? "Salvando..." : "Salvar Senha"}
        </Button>
      </div>
    </form>
  )
}

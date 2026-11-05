import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const redefinirSenhaSchema = z
  .object({
    senha: z
      .string()
      .min(1, "A nova senha é obrigatória.")
      .min(6, "A nova senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string().min(1, "A confirmação da senha é obrigatória."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  })

export type RedefinirSenhaFormValues = z.infer<typeof redefinirSenhaSchema>

type RedefinirSenhaFormProps = {
  onSubmit: (senha: string) => void
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
}

export function RedefinirSenhaForm({
  onSubmit,
  isSubmitting,
  serverError,
  onFieldChange,
}: RedefinirSenhaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RedefinirSenhaFormValues>({
    resolver: zodResolver(redefinirSenhaSchema),
    defaultValues: { senha: "", confirmarSenha: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const senhaField = register("senha", {
    onChange: () => onFieldChange?.(),
  })
  const confirmarSenhaField = register("confirmarSenha", {
    onChange: () => onFieldChange?.(),
  })

  return (
    <form
      className="space-y-2"
      noValidate
      onSubmit={handleSubmit((dados) => onSubmit(dados.senha))}
    >
      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="redefinir-senha"
        >
          Nova senha
        </Label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...senhaField}
            aria-describedby={errors.senha ? "redefinir-senha-erro" : undefined}
            aria-invalid={Boolean(errors.senha)}
            autoComplete="new-password"
            className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
            id="redefinir-senha"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <Button
            aria-label={
              showPassword ? "Ocultar nova senha" : "Mostrar nova senha"
            }
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={() => setShowPassword((valor) => !valor)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <div className="min-h-4">
          {errors.senha ? (
            <p
              className="text-xs font-medium text-destructive"
              id="redefinir-senha-erro"
            >
              {errors.senha.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="redefinir-confirmar-senha"
        >
          Confirmar nova senha
        </Label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...confirmarSenhaField}
            aria-describedby={
              errors.confirmarSenha
                ? "redefinir-confirmar-senha-erro"
                : undefined
            }
            aria-invalid={Boolean(errors.confirmarSenha)}
            autoComplete="new-password"
            className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
            id="redefinir-confirmar-senha"
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
          />
          <Button
            aria-label={
              showConfirmPassword
                ? "Ocultar confirmação de senha"
                : "Mostrar confirmação de senha"
            }
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={() => setShowConfirmPassword((valor) => !valor)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <div className="min-h-4">
          {errors.confirmarSenha ? (
            <p
              className="text-xs font-medium text-destructive"
              id="redefinir-confirmar-senha-erro"
            >
              {errors.confirmarSenha.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="pt-2">
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
          {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
        </Button>
      </div>
    </form>
  )
}

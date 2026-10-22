import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z
  .object({
    nome: z.string().trim().min(1, "O preenchimento do nome é obrigatório."),
    email: z
      .string()
      .trim()
      .min(1, "O preenchimento do e-mail é obrigatório.")
      .email("Por favor, insira um endereço de e-mail válido."),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string().min(1, "A confirmação da senha é obrigatória."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

type RegisterFormProps = {
  onSubmit: (dados: RegisterFormValues) => void
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
}

export function RegisterForm({
  onSubmit,
  isSubmitting,
  serverError,
  onFieldChange,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const nomeField = register("nome", {
    onChange: () => onFieldChange?.(),
  })
  const emailField = register("email", {
    onChange: () => onFieldChange?.(),
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

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="register-nome"
        >
          Nome completo
        </Label>
        <div className="relative">
          <User
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...nomeField}
            aria-describedby={errors.nome ? "register-nome-error" : undefined}
            aria-invalid={Boolean(errors.nome)}
            autoComplete="name"
            className="h-auto rounded-xl bg-muted py-3 pr-4 pl-12 text-sm focus-visible:ring-2"
            id="register-nome"
            placeholder="Seu nome completo"
            type="text"
          />
        </div>
        <div className="min-h-4">
          {errors.nome ? (
            <p
              className="text-xs font-medium text-destructive"
              id="register-nome-error"
            >
              {errors.nome.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="register-email"
        >
          E-mail
        </Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...emailField}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-auto rounded-xl bg-muted py-3 pr-4 pl-12 text-sm focus-visible:ring-2"
            id="register-email"
            placeholder="seu@email.com"
            type="email"
          />
        </div>
        <div className="min-h-4">
          {errors.email ? (
            <p
              className="text-xs font-medium text-destructive"
              id="register-email-error"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="register-senha"
        >
          Senha
        </Label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...senhaField}
            aria-describedby={errors.senha ? "register-senha-error" : undefined}
            aria-invalid={Boolean(errors.senha)}
            autoComplete="new-password"
            className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
            id="register-senha"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <Button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={() => setShowPassword((current) => !current)}
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
              id="register-senha-error"
            >
              {errors.senha.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="register-confirmar-senha"
        >
          Confirmar senha
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
                ? "register-confirmar-senha-error"
                : undefined
            }
            aria-invalid={Boolean(errors.confirmarSenha)}
            autoComplete="new-password"
            className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
            id="register-confirmar-senha"
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
            onClick={() => setShowConfirmPassword((current) => !current)}
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
              id="register-confirmar-senha-error"
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
            <>
              <Loader2 className="animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </div>
    </form>
  )
}

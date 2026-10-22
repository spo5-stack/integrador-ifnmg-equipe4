import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O preenchimento do e-mail é obrigatório.")
    .email("Por favor, insira um endereço de e-mail válido."),
  senha: z.string().min(1, "O preenchimento da senha é obrigatório."),
})

export type LoginFormValues = z.infer<typeof loginSchema>

type LoginFormProps = {
  onSubmit: (dados: LoginFormValues, remember: boolean) => void
  isSubmitting: boolean
  serverError?: string
  onFieldChange?: () => void
}

export function LoginForm({
  onSubmit,
  isSubmitting,
  serverError,
  onFieldChange,
}: LoginFormProps) {
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const emailField = register("email", {
    onChange: () => onFieldChange?.(),
  })
  const senhaField = register("senha", {
    onChange: () => onFieldChange?.(),
  })

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit((dados) => onSubmit(dados, remember))}
    >
      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
          htmlFor="login-email"
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
            aria-describedby={errors.email ? "login-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-auto rounded-lg bg-muted py-3 pr-4 pl-10 text-sm focus-visible:ring-2"
            id="login-email"
            placeholder="nome@empresa.com.br"
            type="email"
          />
        </div>
        {errors.email ? (
          <p
            className="text-xs font-medium text-destructive"
            id="login-email-error"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label
            className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            htmlFor="login-senha"
          >
            Senha
          </Label>
          <button
            aria-disabled="true"
            className="cursor-not-allowed text-xs font-semibold text-primary/60"
            disabled
            title="Disponível em breve"
            type="button"
          >
            Esqueci minha senha
          </button>
        </div>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            {...senhaField}
            aria-describedby={errors.senha ? "login-senha-error" : undefined}
            aria-invalid={Boolean(errors.senha)}
            autoComplete="current-password"
            className="h-auto rounded-lg bg-muted py-3 pr-12 pl-10 text-sm focus-visible:ring-2"
            id="login-senha"
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
        {errors.senha ? (
          <p
            className="text-xs font-medium text-destructive"
            id="login-senha-error"
          >
            {errors.senha.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={remember}
          id="login-remember"
          onCheckedChange={(checked) => {
            setRemember(checked === true)
            onFieldChange?.()
          }}
        />
        <Label
          className="text-sm font-normal text-muted-foreground"
          htmlFor="login-remember"
        >
          Lembrar de mim
        </Label>
      </div>

      <Button
        aria-busy={isSubmitting}
        className="h-auto w-full rounded-xl bg-primary py-4 font-heading text-base font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}

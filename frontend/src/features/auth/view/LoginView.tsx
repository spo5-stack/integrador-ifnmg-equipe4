import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginForm } from "@/features/auth/controller/useLoginForm"
import { AuthShell } from "@/features/auth/view/AuthShell"

export function LoginView() {
  const {
    email,
    senha,
    remember,
    showPassword,
    errors,
    isSubmitting,
    handleEmailChange,
    handleSenhaChange,
    handleRememberChange,
    handleSubmit,
    togglePassword,
  } = useLoginForm()

  return (
    <AuthShell>
      <section className="w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        <header className="relative h-32 overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-primary/40" />
          <div className="absolute -top-12 -right-10 size-44 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-16 -left-8 size-40 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-end p-8">
            <h1 className="font-heading text-xl font-extrabold text-primary-foreground">
              Bem-vindo a Granja
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-primary-foreground/65">
              SISTEMA DE MONITORAMENTO DE LUMINOSIDADE
            </p>
          </div>
        </header>

        <div className="space-y-6 p-8">
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            {errors.geral ? (
              <div
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
                role="alert"
              >
                {errors.geral}
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
                  aria-describedby={
                    errors.email ? "login-email-error" : undefined
                  }
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="h-auto rounded-lg bg-muted py-3 pr-4 pl-10 text-sm focus-visible:ring-2"
                  id="login-email"
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="nome@empresa.com.br"
                  type="email"
                  value={email}
                />
              </div>
              {errors.email ? (
                <p
                  className="text-xs font-medium text-destructive"
                  id="login-email-error"
                >
                  {errors.email}
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
                  aria-describedby={
                    errors.senha ? "login-senha-error" : undefined
                  }
                  aria-invalid={Boolean(errors.senha)}
                  autoComplete="current-password"
                  className="h-auto rounded-lg bg-muted py-3 pr-12 pl-10 text-sm focus-visible:ring-2"
                  id="login-senha"
                  name="senha"
                  onChange={handleSenhaChange}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                />
                <Button
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                  onClick={togglePassword}
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
                  {errors.senha}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={remember}
                id="login-remember"
                onCheckedChange={(checked) =>
                  handleRememberChange(checked === true)
                }
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

          <div className="border-t border-border/40 pt-4">
            <p className="text-center text-xs text-muted-foreground">
              Não possui uma conta?{" "}
              <Link
                className="font-bold text-primary hover:underline"
                to="/cadastro"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </section>
    </AuthShell>
  )
}

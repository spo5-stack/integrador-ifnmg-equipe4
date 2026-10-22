import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/AuthShell"
import { useRegisterForm } from "@/features/auth/controller/useRegisterForm"

export function RegisterView() {
  const {
    nome,
    email,
    senha,
    confirmarSenha,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    handleNomeChange,
    handleEmailChange,
    handleSenhaChange,
    handleConfirmarSenhaChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  } = useRegisterForm()

  return (
    <AuthShell>
      <section className="my-auto w-full max-w-[480px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-card-foreground">
              Criar sua conta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Preencha os dados abaixo para começar.
            </p>
          </div>

          <form className="space-y-2" noValidate onSubmit={handleSubmit}>
            {errors.geral ? (
              <div
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
                role="alert"
              >
                {errors.geral}
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
                  aria-describedby={
                    errors.nome ? "register-nome-error" : undefined
                  }
                  aria-invalid={Boolean(errors.nome)}
                  autoComplete="name"
                  className="h-auto rounded-xl bg-muted py-3 pr-4 pl-12 text-sm focus-visible:ring-2"
                  id="register-nome"
                  name="nome"
                  onChange={handleNomeChange}
                  placeholder="Seu nome completo"
                  type="text"
                  value={nome}
                />
              </div>
              <div className="min-h-4">
                {errors.nome ? (
                  <p
                    className="text-xs font-medium text-destructive"
                    id="register-nome-error"
                  >
                    {errors.nome}
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
                  aria-describedby={
                    errors.email ? "register-email-error" : undefined
                  }
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="h-auto rounded-xl bg-muted py-3 pr-4 pl-12 text-sm focus-visible:ring-2"
                  id="register-email"
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                />
              </div>
              <div className="min-h-4">
                {errors.email ? (
                  <p
                    className="text-xs font-medium text-destructive"
                    id="register-email-error"
                  >
                    {errors.email}
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
                  aria-describedby={
                    errors.senha ? "register-senha-error" : undefined
                  }
                  aria-invalid={Boolean(errors.senha)}
                  autoComplete="new-password"
                  className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
                  id="register-senha"
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
              <div className="min-h-4">
                {errors.senha ? (
                  <p
                    className="text-xs font-medium text-destructive"
                    id="register-senha-error"
                  >
                    {errors.senha}
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
                  aria-describedby={
                    errors.confirmarSenha
                      ? "register-confirmar-senha-error"
                      : undefined
                  }
                  aria-invalid={Boolean(errors.confirmarSenha)}
                  autoComplete="new-password"
                  className="h-auto rounded-xl bg-muted py-3 pr-12 pl-12 text-sm focus-visible:ring-2"
                  id="register-confirmar-senha"
                  name="confirmarSenha"
                  onChange={handleConfirmarSenhaChange}
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmarSenha}
                />
                <Button
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmação de senha"
                      : "Mostrar confirmação de senha"
                  }
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                  onClick={toggleConfirmPassword}
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
                    {errors.confirmarSenha}
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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                className="font-semibold text-primary underline-offset-4 hover:underline"
                to="/login"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </section>
    </AuthShell>
  )
}

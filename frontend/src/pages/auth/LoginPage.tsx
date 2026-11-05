import { useMutation } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import { LoginForm, type LoginFormValues } from "@/components/login/LoginForm"
import { SuccessBanner } from "@/components/feedback/SuccessBanner"
import { useAuth } from "@/contexts/AuthContext"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { login } from "@/services/authService"

type LocationState = {
  from?: {
    pathname?: string
  }
  sucesso?: string
}

type LoginVariables = {
  dados: LoginFormValues
  remember: boolean
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const sucesso = (location.state as LocationState | null)?.sucesso

  const mutation = useMutation({
    mutationFn: ({ dados }: LoginVariables) => login(dados),
    onSuccess: (session, variables) => {
      signIn(session, variables.remember)
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? "/", { replace: true })
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? status === 401
      ? "E-mail ou senha incorretos."
      : status === 400
        ? "Verifique os dados informados."
        : getApiErrorMessage(
            mutation.error,
            "Não foi possível entrar. Tente novamente."
          )
    : undefined

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
          {sucesso ? (
            <SuccessBanner
              message={sucesso}
              onDismiss={() =>
                navigate(location.pathname, { replace: true, state: null })
              }
            />
          ) : null}

          <LoginForm
            isSubmitting={mutation.isPending}
            onFieldChange={() => {
              if (mutation.isError) mutation.reset()
            }}
            onSubmit={(dados, remember) => mutation.mutate({ dados, remember })}
            serverError={serverError}
          />

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

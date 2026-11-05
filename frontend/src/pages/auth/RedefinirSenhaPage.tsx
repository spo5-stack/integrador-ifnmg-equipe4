import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, LockKeyhole } from "lucide-react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import { RedefinirSenhaForm } from "@/components/senha/RedefinirSenhaForm"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { redefinirSenha } from "@/services/recuperacaoSenhaService"

type RedefinirLocationState = {
  resetToken?: string
}

export function RedefinirSenhaPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const resetToken = (location.state as RedefinirLocationState | null)
    ?.resetToken

  const mutation = useMutation({
    mutationFn: (senha: string) =>
      redefinirSenha({ resetToken: resetToken as string, senha }),
    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: { sucesso: "Senha redefinida com sucesso!" },
      })
    },
  })

  if (!resetToken) {
    return <Navigate replace to="/esqueci-senha" />
  }

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        "Não foi possível redefinir a senha. Tente novamente."
      )
    : undefined

  return (
    <AuthShell>
      <section className="my-auto w-full max-w-[480px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-accent text-accent-foreground">
              <LockKeyhole aria-hidden="true" className="size-8" />
            </div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              Redefinir Senha
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie uma nova senha para acessar sua conta.
            </p>
          </div>

          <RedefinirSenhaForm
            isSubmitting={mutation.isPending}
            onFieldChange={() => {
              if (mutation.isError) mutation.reset()
            }}
            onSubmit={(senha) => mutation.mutate(senha)}
            serverError={serverError}
          />

          {status === 401 ? (
            <div className="mt-4 text-center">
              <Link
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                to="/esqueci-senha"
              >
                Solicitar um novo código
              </Link>
            </div>
          ) : null}

          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary underline-offset-4 transition-all hover:underline"
              to="/login"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </section>
    </AuthShell>
  )
}

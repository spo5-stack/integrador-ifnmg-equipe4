import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import {
  RegisterForm,
  type RegisterFormValues,
} from "@/components/register/RegisterForm"
import { useAuth } from "@/contexts/AuthContext"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { register } from "@/services/authService"

export function RegisterPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (dados: RegisterFormValues) => register(dados),
    onSuccess: (session) => {
      signIn(session, false)
      navigate("/", { replace: true })
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? status === 409
      ? "Este e-mail já está cadastrado."
      : status === 400
        ? "Verifique os dados informados."
        : getApiErrorMessage(
            mutation.error,
            "Não foi possível criar sua conta. Tente novamente."
          )
    : undefined

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

          <RegisterForm
            isSubmitting={mutation.isPending}
            onFieldChange={() => {
              if (mutation.isError) mutation.reset()
            }}
            onSubmit={(dados) => mutation.mutate(dados)}
            serverError={serverError}
          />

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

import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, LockKeyhole } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import {
  EsqueciSenhaForm,
  type EsqueciSenhaFormValues,
} from "@/components/senha/EsqueciSenhaForm"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { solicitarRecuperacao } from "@/services/recuperacaoSenhaService"

export function EsqueciSenhaPage() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (dados: EsqueciSenhaFormValues) =>
      solicitarRecuperacao({ email: dados.email }),
    onSuccess: (_resposta, dados) => {
      navigate("/esqueci-senha/codigo", {
        state: { email: dados.email.trim() },
      })
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        status === 400
          ? "Verifique o e-mail informado."
          : "Não foi possível enviar o código. Tente novamente."
      )
    : undefined

  return (
    <AuthShell>
      <section className="my-auto w-full max-w-md overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        <div className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
              <LockKeyhole aria-hidden="true" className="size-6" />
            </div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              Esqueci minha senha
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Insira seu e-mail abaixo para receber um código de recuperação.
            </p>
          </div>

          <EsqueciSenhaForm
            isSubmitting={mutation.isPending}
            onFieldChange={() => {
              if (mutation.isError) mutation.reset()
            }}
            onSubmit={(dados) => mutation.mutate(dados)}
            serverError={serverError}
          />

          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary underline-offset-4 transition-all hover:underline"
              to="/login"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </section>
    </AuthShell>
  )
}

import { useMutation } from "@tanstack/react-query"
import { ShieldCheck } from "lucide-react"
import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import { CodigoVerificacaoForm } from "@/components/senha/CodigoVerificacaoForm"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import {
  solicitarRecuperacao,
  verificarCodigo,
} from "@/services/recuperacaoSenhaService"

type CodigoLocationState = {
  email?: string
}

export function CodigoVerificacaoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = (location.state as CodigoLocationState | null)?.email
  const [avisoReenvio, setAvisoReenvio] = useState<string | null>(null)

  const verificacaoMutation = useMutation({
    mutationFn: (codigo: string) =>
      verificarCodigo({ email: email as string, codigo }),
    onSuccess: (resposta) => {
      navigate("/esqueci-senha/redefinir", {
        replace: true,
        state: { resetToken: resposta.resetToken },
      })
    },
  })

  const reenvioMutation = useMutation({
    mutationFn: () => solicitarRecuperacao({ email: email as string }),
    onSuccess: (resposta) => {
      setAvisoReenvio(resposta.mensagem)
    },
  })

  if (!email) {
    return <Navigate replace to="/esqueci-senha" />
  }

  const statusVerificacao = verificacaoMutation.isError
    ? getApiErrorStatus(verificacaoMutation.error)
    : undefined
  const serverError = verificacaoMutation.isError
    ? getApiErrorMessage(
        verificacaoMutation.error,
        statusVerificacao === 401
          ? "Código inválido ou expirado."
          : "Não foi possível verificar o código. Tente novamente."
      )
    : reenvioMutation.isError
      ? getApiErrorMessage(
          reenvioMutation.error,
          "Não foi possível reenviar o código. Tente novamente."
        )
      : undefined

  return (
    <AuthShell>
      <section className="my-auto w-full max-w-[480px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
        <div className="p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-accent text-accent-foreground">
              <ShieldCheck aria-hidden="true" className="size-8" />
            </div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              Verificar Código
            </h1>
            <p className="mt-2 max-w-[320px] text-sm text-muted-foreground">
              Insira o código de 6 dígitos enviado para {email}.
            </p>
          </div>

          <CodigoVerificacaoForm
            avisoReenvio={reenvioMutation.isSuccess ? avisoReenvio : null}
            isReenviando={reenvioMutation.isPending}
            isSubmitting={verificacaoMutation.isPending}
            onFieldChange={() => {
              if (verificacaoMutation.isError) verificacaoMutation.reset()
              if (reenvioMutation.isError) reenvioMutation.reset()
            }}
            onReenviar={() => {
              setAvisoReenvio(null)
              reenvioMutation.mutate()
            }}
            onSubmit={(codigo) => verificacaoMutation.mutate(codigo)}
            serverError={serverError}
          />
        </div>
      </section>
    </AuthShell>
  )
}

import { Navigate } from "react-router-dom"
import { SuccessBanner } from "@/components/feedback/SuccessBanner"
import { NomeForm } from "@/components/perfil/NomeForm"
import { SenhaForm } from "@/components/perfil/SenhaForm"
import { ZonaPerigoCard } from "@/components/perfil/ZonaPerigoCard"
import { usePerfil } from "@/hooks/usePerfil"

export function PerfilPage() {
  const {
    usuario,
    nomeInicial,
    isAlterandoNome,
    erroNome,
    salvarNome,
    resetErroNome,
    isAlterandoSenha,
    erroSenha,
    salvarSenha,
    resetErroSenha,
    feedbackNome,
    feedbackSenha,
    fecharFeedback,
    isExcluindoConta,
    erroExclusao,
    excluirConta,
  } = usePerfil()

  if (!usuario) {
    return <Navigate replace to="/login" />
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie seus dados pessoais e preferências.
        </p>
      </header>

      {feedbackNome ? (
        <SuccessBanner message={feedbackNome} onDismiss={fecharFeedback} />
      ) : null}
      {feedbackSenha ? (
        <SuccessBanner message={feedbackSenha} onDismiss={fecharFeedback} />
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <NomeForm
            isSubmitting={isAlterandoNome}
            nomeInicial={nomeInicial}
            onFieldChange={resetErroNome}
            onSubmit={salvarNome}
            serverError={erroNome}
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <SenhaForm
            isSubmitting={isAlterandoSenha}
            onFieldChange={resetErroSenha}
            onSubmit={salvarSenha}
            serverError={erroSenha}
          />
        </section>
      </div>

      <ZonaPerigoCard
        erro={erroExclusao ?? undefined}
        isSubmitting={isExcluindoConta}
        onConfirmar={excluirConta}
      />
    </div>
  )
}

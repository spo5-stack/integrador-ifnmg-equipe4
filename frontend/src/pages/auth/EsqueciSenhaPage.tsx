import { ArrowLeft, LockKeyhole } from "lucide-react"
import { Link } from "react-router-dom"
import { AuthShell } from "@/components/auth/AuthShell"
import { EsqueciSenhaForm } from "@/components/senha/EsqueciSenhaForm"

export function EsqueciSenhaPage() {
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
              Insira seu e-mail abaixo para receber as instruções de recuperação
              de acesso.
            </p>
          </div>

          <EsqueciSenhaForm />

          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary underline-offset-4 transition-all hover:underline"
              to="/login"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:-translate-x-1"
              />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </section>
    </AuthShell>
  )
}

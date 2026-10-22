import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/controller/AuthContext"

export function AuthHomeView() {
  const { usuario, logout } = useAuth()

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6">
      <section className="w-full max-w-lg rounded-xl border border-border/60 bg-card p-8 shadow-sm">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          Área privada
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">
          Olá, {usuario?.nome ?? "usuário"}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O dashboard será implementado na próxima task.
        </p>
        <Button className="mt-6" onClick={logout} type="button">
          Sair
        </Button>
      </section>
    </main>
  )
}

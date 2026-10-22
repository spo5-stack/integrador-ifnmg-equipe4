import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useCriarGalpaoForm } from "@/features/galpoes/controller/useCriarGalpaoForm"
import { GalpaoForm } from "@/features/galpoes/view/GalpaoForm"

export function CriarGalpaoView() {
  const {
    nome,
    capacidade,
    errors,
    isSubmitting,
    onChangeNome,
    onChangeCapacidade,
    onSubmit,
  } = useCriarGalpaoForm()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          to="/galpoes"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Link>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Novo Galpão
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre um novo galpão no sistema.
        </p>
      </header>

      <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <GalpaoForm
          cancelHref="/galpoes"
          capacidade={capacidade}
          errors={errors}
          isSubmitting={isSubmitting}
          nome={nome}
          onChangeCapacidade={onChangeCapacidade}
          onChangeNome={onChangeNome}
          onSubmit={(event) => void onSubmit(event)}
          submitLabel="Salvar"
        />
      </section>
    </div>
  )
}

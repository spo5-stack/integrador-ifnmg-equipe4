import { ArrowLeft, Building2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEditarGalpaoForm } from "@/features/galpoes/controller/useEditarGalpaoForm"
import { GalpaoForm } from "@/features/galpoes/view/GalpaoForm"
import { cn } from "@/lib/utils"

function FormularioSkeleton() {
  return (
    <div
      aria-busy="true"
      className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <div className="space-y-2 border-b border-border/60 pb-5">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <div className="mt-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}

export function EditarGalpaoView() {
  const { id } = useParams<{ id: string }>()
  const {
    nome,
    capacidade,
    errors,
    isLoading,
    naoEncontrado,
    erroCarregamento,
    isSubmitting,
    recarregar,
    onChangeNome,
    onChangeCapacidade,
    onSubmit,
  } = useEditarGalpaoForm(id)

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
          Editar Galpão
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Altere os dados do galpão.
        </p>
      </header>

      {isLoading ? <FormularioSkeleton /> : null}

      {!isLoading && erroCarregamento ? (
        <div className="max-w-2xl">
          <RequestError message={erroCarregamento} onRetry={recarregar} />
        </div>
      ) : null}

      {!isLoading && naoEncontrado ? (
        <section className="flex max-w-2xl flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Building2 aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">
              Galpão não encontrado
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              O galpão informado não existe ou foi removido.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto px-5 py-2.5"
            )}
            to="/galpoes"
          >
            Voltar para Galpões
          </Link>
        </section>
      ) : null}

      {!isLoading && !naoEncontrado && !erroCarregamento ? (
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
      ) : null}
    </div>
  )
}

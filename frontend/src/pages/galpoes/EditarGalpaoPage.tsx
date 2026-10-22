import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Building2 } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { GalpaoForm } from "@/components/galpoes/GalpaoForm"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { atualizarGalpao, obterGalpao } from "@/services/galpaoService"
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

export function EditarGalpaoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["galpao", id],
    queryFn: ({ signal }) => obterGalpao(id as string, signal),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: (dados: { nome: string; capacidade: number }) =>
      atualizarGalpao(id as string, dados),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["galpoes"] })
      void queryClient.invalidateQueries({ queryKey: ["galpao", id] })
      navigate("/galpoes", {
        state: { sucesso: "Galpão atualizado com sucesso." },
      })
    },
  })

  const statusCarregamento = query.isError
    ? getApiErrorStatus(query.error)
    : undefined
  const naoEncontrado =
    !id || statusCarregamento === 404 || statusCarregamento === 400
  const erroCarregamento =
    query.isError && !naoEncontrado
      ? getApiErrorMessage(
          query.error,
          "Não foi possível carregar o galpão. Tente novamente."
        )
      : null

  const isLoading = query.isPending && query.fetchStatus !== "idle"

  const statusEnvio = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        statusEnvio === 400
          ? "Dados inválidos. Verifique os campos e tente novamente."
          : "Não foi possível atualizar o galpão. Tente novamente."
      )
    : undefined

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
          <RequestError
            message={erroCarregamento}
            onRetry={() => void query.refetch()}
          />
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

      {!isLoading && query.data && !erroCarregamento && !naoEncontrado ? (
        <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <GalpaoForm
            cancelHref="/galpoes"
            defaultValues={{
              nome: query.data.nome,
              capacidade: String(query.data.capacidade),
            }}
            isSubmitting={mutation.isPending}
            onFieldChange={() => {
              if (mutation.isError) mutation.reset()
            }}
            onSubmit={(dados) =>
              mutation.mutate({
                nome: dados.nome,
                capacidade: Number(dados.capacidade),
              })
            }
            serverError={serverError}
            submitLabel="Salvar"
          />
        </section>
      ) : null}
    </div>
  )
}

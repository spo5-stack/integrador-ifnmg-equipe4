import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { CadastrarLoteForm } from "@/components/lotes/CadastrarLoteForm"
import { useCadastrarLote } from "@/hooks/useCadastrarLote"

export function CadastrarLotePage() {
  const { galpaoId } = useParams<{ galpaoId: string }>()
  const {
    galpoes,
    isLoadingGalpoes,
    erroGalpoes,
    recarregarGalpoes,
    isSubmitting,
    serverError,
    resetServerError,
    cadastrar,
  } = useCadastrarLote(galpaoId)

  const voltarPara = galpaoId
    ? `/galpoes/${encodeURIComponent(galpaoId)}`
    : "/galpoes"

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          to={voltarPara}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Link>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Cadastrar Lote
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre a entrada de aves neste galpão.
        </p>
      </header>

      <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <CadastrarLoteForm
          cancelHref={voltarPara}
          erroGalpoes={erroGalpoes}
          galpaoIdInicial={galpaoId}
          galpoes={galpoes}
          isLoadingGalpoes={isLoadingGalpoes}
          isSubmitting={isSubmitting}
          onFieldChange={resetServerError}
          onRetryGalpoes={recarregarGalpoes}
          onSubmit={(dados) => cadastrar(dados.galpaoId, dados)}
          serverError={serverError}
        />
      </section>
    </div>
  )
}

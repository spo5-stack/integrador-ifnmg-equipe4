import { Loader2, Plus, Search, Trash2 } from "lucide-react"
import { RequestError } from "@/components/feedback/RequestError"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGalpoes } from "@/features/galpoes/controller/useGalpoes"
import { GalpoesTable } from "@/features/galpoes/view/GalpoesTable"

export function GalpoesView() {
  const {
    pagina,
    galpoesFiltrados,
    total,
    totalPaginas,
    inicio,
    fim,
    isLoading,
    erro,
    busca,
    temBusca,
    galpaoParaExcluir,
    isExcluindo,
    erroExclusao,
    recarregar,
    mudarBusca,
    irParaPagina,
    solicitarExclusao,
    cancelarExclusao,
    confirmarExclusao,
  } = useGalpoes()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            Galpões
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus galpões cadastrados.
          </p>
        </div>
        <Button
          className="h-auto rounded-lg bg-primary px-6 py-2.5 font-heading text-sm font-bold text-primary-foreground"
          disabled
          title="Disponível em breve"
          type="button"
        >
          <Plus aria-hidden="true" />
          Novo Galpão
        </Button>
      </header>

      <div>
        <div className="relative max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label className="sr-only" htmlFor="busca-galpoes">
            Buscar galpões por nome
          </label>
          <Input
            className="h-auto rounded-lg border-input bg-muted py-2.5 pr-4 pl-10 text-sm focus-visible:ring-2"
            id="busca-galpoes"
            onChange={(event) => mudarBusca(event.target.value)}
            placeholder="Buscar por nome..."
            type="search"
            value={busca}
          />
        </div>
        {temBusca ? (
          <p className="mt-2 text-xs text-muted-foreground">
            A busca filtra apenas os galpões desta página.
          </p>
        ) : null}
      </div>

      {erro ? <RequestError message={erro} onRetry={recarregar} /> : null}

      {erroExclusao ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {erroExclusao}
        </div>
      ) : null}

      {!erro ? (
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <GalpoesTable
            galpoes={galpoesFiltrados}
            isLoading={isLoading}
            onSolicitarExclusao={solicitarExclusao}
            temBusca={temBusca}
          />

          {!isLoading && total > 0 ? (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 px-6 py-4 sm:flex-row">
              <span className="text-sm text-muted-foreground">
                {inicio}–{fim} de {total}
                {temBusca ? (
                  <span className="ml-2 text-xs">
                    ({galpoesFiltrados.length} nesta página)
                  </span>
                ) : null}
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={pagina <= 1 || isLoading}
                  onClick={() => irParaPagina(pagina - 1)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Anterior
                </Button>
                <Button
                  disabled={pagina >= totalPaginas || isLoading}
                  onClick={() => irParaPagina(pagina + 1)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Próximo
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <AlertDialog
        onOpenChange={(aberto) => {
          if (!aberto) cancelarExclusao()
        }}
        open={galpaoParaExcluir !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir galpão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O galpão{" "}
              <strong className="font-semibold text-foreground">
                {galpaoParaExcluir?.nome}
              </strong>{" "}
              será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isExcluindo}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isExcluindo}
              onClick={() => void confirmarExclusao()}
            >
              {isExcluindo ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              {isExcluindo ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

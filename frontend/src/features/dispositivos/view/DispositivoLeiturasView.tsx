import { ArrowLeft } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDispositivoLeituras } from "@/features/dispositivos/controller/useDispositivoLeituras"
import type { Dispositivo } from "@/features/dispositivos/model/dispositivo.types"

type LocationState = {
  dispositivo?: Dispositivo
  galpaoNome?: string
  galpoesId?: string
}

function LeiturasSkeleton() {
  return (
    <div aria-busy="true" className="space-y-3 p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="grid grid-cols-2 items-center gap-4" key={index}>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-40" />
        </div>
      ))}
    </div>
  )
}

function formatarDataHora(valor: string): string {
  const data = new Date(valor)
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleString("pt-BR")
}

export function DispositivoLeiturasView() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const estado = location.state as LocationState | null
  const dispositivo = estado?.dispositivo
  const voltarPara = estado?.galpoesId
    ? `/galpoes/${encodeURIComponent(estado.galpoesId)}`
    : "/galpoes"
  const {
    leituras,
    pagina,
    total,
    totalPaginas,
    inicio,
    fim,
    isLoading,
    erro,
    irParaPagina,
    recarregar,
  } = useDispositivoLeituras(id)

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
          {dispositivo ? dispositivo.nome : "Leituras do Dispositivo"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dispositivo
            ? [dispositivo.modelo, estado?.galpaoNome]
                .filter(Boolean)
                .join(" · ")
            : "Histórico de luminosidade registrado."}
        </p>
      </header>

      {erro ? <RequestError message={erro} onRetry={recarregar} /> : null}

      {!erro ? (
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="px-6 py-5">
            <h2 className="font-heading text-lg font-extrabold">
              Histórico de Leituras
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ordenadas por mais recente.
            </p>
          </div>

          {isLoading ? (
            <LeiturasSkeleton />
          ) : leituras.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              Nenhuma leitura registrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Valor (luminosidade)", "Data/Hora"].map((coluna) => (
                    <TableHead
                      className="h-12 px-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                      key={coluna}
                    >
                      {coluna}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leituras.map((leitura) => (
                  <TableRow key={leitura.id}>
                    <TableCell className="px-6 py-4 font-medium">
                      {leitura.valorLuminosidade.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {formatarDataHora(leitura.criadoEm)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && total > 0 ? (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 px-6 py-4 sm:flex-row">
              <span className="text-sm text-muted-foreground">
                {inicio}–{fim} de {total}
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
    </div>
  )
}

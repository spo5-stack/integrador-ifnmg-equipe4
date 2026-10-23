import {
  ArrowLeft,
  Ban,
  BarChart3,
  Bird,
  Building2,
  Cpu,
  Lightbulb,
  Pencil,
  Plus,
  SunMedium,
} from "lucide-react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { SuccessBanner } from "@/components/feedback/SuccessBanner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGalpaoDetalhe } from "@/hooks/useGalpaoDetalhe"
import { useGalpaoStatus } from "@/hooks/useGalpaoStatus"
import type { LoteDoGalpao } from "@/interfaces/galpao"
import { calcularDiasDesde, formatarData, formatarDataHora } from "@/lib/datas"
import { cn } from "@/lib/utils"

const BADGE_BASE = "rounded-full px-3 py-1 text-xs font-semibold"
const CARD = "rounded-xl border border-border bg-card shadow-sm"
const LABEL = "text-[10px] font-bold tracking-widest uppercase"
const TH =
  "h-12 px-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"

const ESTILOS_FASE: Record<string, string> = {
  INICIAL: "bg-accent text-accent-foreground",
  CRESCIMENTO: "bg-secondary text-secondary-foreground",
  PRODUCAO: "bg-primary text-primary-foreground",
}

const FAIXA_IDEAL_POR_FASE: Record<string, { min: number; max: number }> = {
  INICIAL: { min: 70, max: 100 },
  CRESCIMENTO: { min: 50, max: 70 },
  PRODUCAO: { min: 30, max: 50 },
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        BADGE_BASE,
        status === "ATIVO"
          ? "bg-secondary text-secondary-foreground"
          : "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  )
}

function FaseBadge({ fase }: { fase: string }) {
  return (
    <span
      className={cn(
        BADGE_BASE,
        ESTILOS_FASE[fase] ?? "bg-muted text-muted-foreground"
      )}
    >
      {fase}
    </span>
  )
}

function StatusLuminosidadeBadge({ status }: { status: string }) {
  const statusUpper = status.toUpperCase()
  return (
    <span
      className={cn(
        BADGE_BASE,
        statusUpper === "ADEQUADO"
          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
          : statusUpper === "ABAIXO" || statusUpper === "ACIMA"
            ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
            : "bg-muted text-muted-foreground"
      )}
      title="Status de luminosidade calculado pelo backend com base na faixa ideal da fase do lote"
    >
      {status}
    </span>
  )
}

/** Barra 0–100% com a faixa ideal destacada e, opcionalmente, a leitura atual. */
function BarraFaixa({
  min,
  max,
  valor,
}: {
  min: number
  max: number
  valor?: number | null
}) {
  const marcador =
    valor === undefined || valor === null
      ? null
      : Math.min(100, Math.max(0, valor))

  return (
    <div
      aria-hidden="true"
      className="relative h-2 w-full rounded-full bg-muted"
    >
      <div
        className="absolute inset-y-0 rounded-full bg-emerald-500/30 dark:bg-emerald-500/40"
        style={{ left: `${min}%`, width: `${max - min}%` }}
      />
      {marcador !== null ? (
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow"
          style={{ left: `${marcador}%` }}
        />
      ) : null}
    </div>
  )
}

function CardTitulo({
  icone,
  children,
}: {
  icone: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icone}
      <h2 className={LABEL}>{children}</h2>
    </div>
  )
}

function DetalheSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

function EstadoNaoEncontrado() {
  return (
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
  )
}

function TabelaLotes({ lotes }: { lotes: LoteDoGalpao[] }) {
  if (lotes.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-muted-foreground">
        Nenhum lote neste galpão.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {["Quantidade", "Data Início", "Status", "Fase", "Ações"].map(
            (coluna) => (
              <TableHead className={TH} key={coluna}>
                {coluna}
              </TableHead>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lotes.map((lote) => (
          <TableRow key={lote.id}>
            <TableCell className="px-6 py-4 font-medium">
              {lote.quantidade.toLocaleString("pt-BR")}
            </TableCell>
            <TableCell className="px-6 py-4">
              {formatarData(lote.dataInicio)}
            </TableCell>
            <TableCell className="px-6 py-4">
              <StatusBadge status={lote.status} />
            </TableCell>
            <TableCell className="px-6 py-4">
              <FaseBadge fase={lote.fase} />
            </TableCell>
            <TableCell className="px-6 py-4">
              {lote.status === "ATIVO" ? (
                <Button
                  className="text-muted-foreground"
                  disabled
                  size="sm"
                  title="Disponível em breve"
                  type="button"
                  variant="ghost"
                >
                  <Ban aria-hidden="true" />
                  Encerrar
                </Button>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function GalpaoDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const sucesso = (location.state as { sucesso?: string } | null)?.sucesso
  const { dados, isLoading, naoEncontrado, erro, recarregar } =
    useGalpaoDetalhe(id)
  const { status: statusMonitoramento } = useGalpaoStatus(id)

  const loteAtivo = dados?.lotes.find((lote) => lote.status === "ATIVO")
  const loteAtivoStatus = statusMonitoramento?.loteAtivo ?? loteAtivo ?? null
  const faixaIdeal = loteAtivoStatus
    ? FAIXA_IDEAL_POR_FASE[loteAtivoStatus.fase]
    : undefined

  const totalAdequados =
    statusMonitoramento?.dispositivos.filter(
      (d) => d.statusLuminosidade?.toUpperCase() === "ADEQUADO"
    ).length ?? 0

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

        {dados ? (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight">
                {dados.nome}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Capacidade: {dados.capacidade.toLocaleString("pt-BR")} aves
              </p>
            </div>
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto w-fit px-5 py-2.5 font-heading text-sm font-bold"
              )}
              to={`/galpoes/${encodeURIComponent(dados.id)}/editar`}
            >
              <Pencil aria-hidden="true" />
              Editar
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight">
              Detalhe do Galpão
            </h1>
            <p className="text-sm text-muted-foreground">
              Informações do galpão selecionado.
            </p>
          </div>
        )}
      </header>

      {sucesso ? (
        <SuccessBanner
          message={sucesso}
          onDismiss={() =>
            navigate(location.pathname, { replace: true, state: null })
          }
        />
      ) : null}

      {isLoading ? <DetalheSkeleton /> : null}

      {!isLoading && erro ? (
        <RequestError message={erro} onRetry={recarregar} />
      ) : null}

      {!isLoading && naoEncontrado ? <EstadoNaoEncontrado /> : null}

      {!isLoading && dados && !erro && !naoEncontrado ? (
        <>
          {/* Resumo: lote, fase e dispositivos */}
          <section
            aria-label="Resumo do galpão"
            className="grid gap-6 md:grid-cols-3"
          >
            <div className={cn(CARD, "p-6")}>
              <CardTitulo
                icone={
                  <Bird aria-hidden="true" className="size-4 text-primary" />
                }
              >
                Lote Ativo
              </CardTitulo>
              {loteAtivoStatus ? (
                <div className="mt-4 space-y-1">
                  <p className="font-heading text-2xl font-extrabold">
                    {loteAtivoStatus.quantidade.toLocaleString("pt-BR")} aves
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {calcularDiasDesde(loteAtivoStatus.dataInicio)} dias desde
                    o início
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nenhum lote ativo
                </p>
              )}
            </div>

            <div className={cn(CARD, "p-6")}>
              <CardTitulo
                icone={
                  <SunMedium
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />
                }
              >
                Fase
              </CardTitulo>
              {loteAtivoStatus ? (
                <div className="mt-4 space-y-2">
                  <FaseBadge fase={loteAtivoStatus.fase} />
                  <p className="text-xs text-muted-foreground">
                    Calculada pelo backend pelos dias do lote
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">—</p>
              )}
            </div>

            <div className={cn(CARD, "p-6")}>
              <CardTitulo
                icone={
                  <Cpu aria-hidden="true" className="size-4 text-primary" />
                }
              >
                Dispositivos
              </CardTitulo>
              <p className="mt-4 font-heading text-2xl font-extrabold">
                {dados.dispositivos.length}
              </p>
              <p className="text-sm text-muted-foreground">cadastrados</p>
            </div>
          </section>

          {/* Luminosidade: faixa ideal + situação por dispositivo */}
          <section
            aria-label="Luminosidade por dispositivo"
            className={cn(CARD, "overflow-hidden")}
          >
            <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Lightbulb
                    aria-hidden="true"
                    className="size-5 text-primary"
                  />
                  <h2 className="font-heading text-lg font-extrabold">
                    Luminosidade
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Leitura atual de cada dispositivo comparada à faixa ideal da
                  fase do lote.
                </p>
              </div>

              {loteAtivoStatus && faixaIdeal ? (
                <div className="w-full rounded-xl border border-border/60 bg-muted/40 p-4 md:w-72">
                  <p className={cn(LABEL, "text-muted-foreground")}>
                    Faixa ideal · {loteAtivoStatus.fase}
                  </p>
                  <p className="mt-1 font-heading text-2xl font-extrabold">
                    {faixaIdeal.min}% – {faixaIdeal.max}%
                  </p>
                  <div className="mt-3">
                    <BarraFaixa max={faixaIdeal.max} min={faixaIdeal.min} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {totalAdequados} de{" "}
                    {statusMonitoramento?.dispositivos.length ?? 0} dispositivos
                    adequados
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-border">
              {!loteAtivoStatus || !faixaIdeal ? (
                <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Indisponível sem lote ativo
                </p>
              ) : dados.dispositivos.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Nenhum dispositivo neste galpão.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {dados.dispositivos.map((dispositivo) => {
                    const statusDispositivo =
                      statusMonitoramento?.dispositivos.find(
                        (item) => item.id === dispositivo.id
                      )
                    const leitura = dispositivo.ultimaLeitura

                    return (
                      <li
                        className="grid items-center gap-4 px-6 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]"
                        key={dispositivo.id}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {dispositivo.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leitura
                              ? `Atualizado em ${formatarDataHora(leitura.criadoEm)}`
                              : "Sem leitura"}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="w-16 shrink-0 font-heading text-xl font-extrabold">
                            {leitura
                              ? `${leitura.valor.toLocaleString("pt-BR")}%`
                              : "—"}
                          </span>
                          <div className="flex-1">
                            <BarraFaixa
                              max={faixaIdeal.max}
                              min={faixaIdeal.min}
                              valor={leitura?.valor}
                            />
                          </div>
                        </div>

                        <div className="md:justify-self-end">
                          {statusDispositivo?.statusLuminosidade ? (
                            <StatusLuminosidadeBadge
                              status={statusDispositivo.statusLuminosidade}
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              —
                            </span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* Dispositivos: cadastro e ações */}
          <section
            aria-label="Dispositivos do galpão"
            className={cn(CARD, "overflow-hidden")}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <h2 className="font-heading text-lg font-extrabold">
                  Dispositivos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sensores cadastrados neste galpão.
                </p>
              </div>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto px-4 py-2"
                )}
                to={`/galpoes/${encodeURIComponent(dados.id)}/dispositivos/novo`}
              >
                <Plus aria-hidden="true" />
                Adicionar
              </Link>
            </div>

            {dados.dispositivos.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                Nenhum dispositivo neste galpão.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Dispositivo", "Modelo", "Status", "Ações"].map(
                      (coluna) => (
                        <TableHead className={TH} key={coluna}>
                          {coluna}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dados.dispositivos.map((dispositivo) => (
                    <TableRow key={dispositivo.id}>
                      <TableCell className="px-6 py-4 font-medium">
                        {dispositivo.nome}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {dispositivo.modelo}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <StatusBadge status={dispositivo.status} />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1">
                          <Link
                            aria-label={`Ver leituras de ${dispositivo.nome}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                              "text-muted-foreground"
                            )}
                            state={{
                              dispositivo,
                              galpaoNome: dados.nome,
                              galpoesId: dados.id,
                            }}
                            title="Ver leituras"
                            to={`/dispositivos/${encodeURIComponent(dispositivo.id)}/leituras`}
                          >
                            <BarChart3 aria-hidden="true" />
                            Ver leituras
                          </Link>
                          <Link
                            aria-label={`Editar ${dispositivo.nome}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                              "text-muted-foreground"
                            )}
                            state={{
                              dispositivo,
                              galpaoNome: dados.nome,
                              galpoesId: dados.id,
                            }}
                            title="Editar"
                            to={`/dispositivos/${encodeURIComponent(dispositivo.id)}/editar`}
                          >
                            <Pencil aria-hidden="true" />
                            Editar
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </section>

          {/* Lotes */}
          <section
            aria-label="Lotes do galpão"
            className={cn(CARD, "overflow-hidden")}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <h2 className="font-heading text-lg font-extrabold">Lotes</h2>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto w-fit px-5 py-2.5 font-heading text-sm font-bold"
                )}
                to={`/galpoes/${encodeURIComponent(dados.id)}/lotes/novo`}
              >
                <Plus aria-hidden="true" />
                Cadastrar Lote
              </Link>
            </div>
            <TabelaLotes lotes={dados.lotes} />
          </section>
        </>
      ) : null}
    </div>
  )
}
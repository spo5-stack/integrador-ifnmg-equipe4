import {
  ArrowRight,
  Bird,
  Building2,
  CircleCheck,
  CirclePlus,
  Cpu,
  Warehouse,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/features/auth/controller/AuthContext"
import { useDashboard } from "@/features/dashboard/controller/useDashboard"
import type { DashboardResumo } from "@/features/dashboard/model/dashboard.types"
import { cn } from "@/lib/utils"

type IndicadorChave = keyof Pick<
  DashboardResumo,
  "totalGalpoes" | "totalLotesAtivos" | "totalDispositivos" | "totalAdequados"
>

type Indicador = {
  chave: IndicadorChave
  label: string
  icon: LucideIcon
  tom: "accent" | "secondary"
}

const INDICADORES: Indicador[] = [
  { chave: "totalGalpoes", label: "Galpões", icon: Warehouse, tom: "accent" },
  {
    chave: "totalLotesAtivos",
    label: "Lotes Ativos",
    icon: Bird,
    tom: "secondary",
  },
  {
    chave: "totalDispositivos",
    label: "Dispositivos",
    icon: Cpu,
    tom: "accent",
  },
  {
    chave: "totalAdequados",
    label: "Adequados",
    icon: CircleCheck,
    tom: "secondary",
  },
]

const ACOES_RAPIDAS = [
  { label: "Novo Galpão", icon: Building2 },
  { label: "Cadastrar Lote", icon: CirclePlus },
  { label: "Gerenciar Dispositivos", icon: Cpu },
]

function iniciaisDoUsuario(nome: string | undefined): string {
  if (!nome) return "US"

  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return "US"

  const primeira = partes[0]?.[0] ?? ""
  const ultima = partes.length > 1 ? (partes.at(-1)?.[0] ?? "") : ""

  return `${primeira}${ultima}`.toLocaleUpperCase("pt-BR")
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
            key={index}
          >
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="w-full space-y-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <Skeleton className="mb-6 h-5 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-9 w-full" key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardView() {
  const { usuario } = useAuth()
  const { dados, galpoesRecentes, isLoading, erro, recarregar } = useDashboard()
  const iniciais = iniciaisDoUsuario(usuario?.nome)
  const nomeUsuario = usuario?.nome ?? "Usuário"

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral do sistema de monitoramento.
          </p>
        </div>
        <div
          aria-label={`Usuário ${nomeUsuario}`}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-accent font-heading text-sm font-extrabold text-accent-foreground"
          role="img"
          title={nomeUsuario}
        >
          {iniciais}
        </div>
      </header>

      {erro ? <RequestError message={erro} onRetry={recarregar} /> : null}

      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && dados ? (
        <>
          <section
            aria-label="Indicadores do sistema"
            className="grid grid-cols-1 gap-6 md:grid-cols-4"
          >
            {INDICADORES.map((indicador) => {
              const Icon = indicador.icon

              return (
                <div
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
                  key={indicador.chave}
                >
                  <div
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-xl",
                      indicador.tom === "accent"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      {indicador.label}
                    </p>
                    <p className="font-heading text-2xl font-extrabold">
                      {dados[indicador.chave]}
                    </p>
                  </div>
                </div>
              )
            })}
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-heading text-lg font-extrabold">Galpões</h2>
              <Link
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                to="/galpoes"
              >
                Ver todos
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            {galpoesRecentes.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum galpão cadastrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Nome", "Capacidade", "Lotes", "Dispositivos"].map(
                      (coluna) => (
                        <TableHead
                          className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                          key={coluna}
                        >
                          {coluna}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galpoesRecentes.map((galpao) => (
                    <TableRow key={galpao.id}>
                      <TableCell className="font-medium">
                        {galpao.nome}
                      </TableCell>
                      <TableCell>
                        {galpao.capacidade.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>{galpao._count.lotes}</TableCell>
                      <TableCell>{galpao._count.dispositivos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="font-heading text-lg font-extrabold">
              Ações Rápidas
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {ACOES_RAPIDAS.map((acao) => {
                const Icon = acao.icon

                return (
                  <button
                    className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-border/60 p-4 text-left text-sm text-muted-foreground opacity-70"
                    disabled
                    key={acao.label}
                    title="Disponível em breve"
                    type="button"
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-5 shrink-0 text-primary"
                    />
                    <span className="font-medium">{acao.label}</span>
                    <span className="ml-auto text-[10px] font-bold tracking-wider uppercase">
                      Em breve
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

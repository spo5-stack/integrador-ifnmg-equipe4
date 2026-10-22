import { Eye, Pencil, Trash2 } from "lucide-react"
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
import type { Galpao } from "@/features/galpoes/model/galpao.types"

type GalpoesTableProps = {
  galpoes: Galpao[]
  isLoading: boolean
  temBusca: boolean
  onSolicitarExclusao: (galpao: Galpao) => void
}

const COLUNAS = [
  "Nome",
  "Capacidade",
  "Lotes",
  "Dispositivos",
  "Ações",
] as const

function TabelaSkeleton() {
  return (
    <div aria-busy="true" className="space-y-3 p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="grid grid-cols-5 items-center gap-4" key={index}>
          {Array.from({ length: 5 }).map((_, coluna) => (
            <Skeleton
              className="h-5"
              key={`${index}-${coluna}`}
              style={{ width: coluna === 0 ? "80%" : "55%" }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function GalpoesTable({
  galpoes,
  isLoading,
  temBusca,
  onSolicitarExclusao,
}: GalpoesTableProps) {
  if (isLoading) return <TabelaSkeleton />

  if (galpoes.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          {temBusca
            ? "Nenhum galpão encontrado para esta busca."
            : "Nenhum galpão cadastrado."}
        </p>
        {temBusca ? (
          <p className="mt-1 text-xs text-muted-foreground">
            A busca considera apenas os galpões desta página.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUNAS.map((coluna) => (
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
        {galpoes.map((galpao) => (
          <TableRow key={galpao.id}>
            <TableCell className="px-6 py-4 font-medium">
              {galpao.nome}
            </TableCell>
            <TableCell className="px-6 py-4">
              {galpao.capacidade.toLocaleString("pt-BR")}
            </TableCell>
            <TableCell className="px-6 py-4">{galpao._count.lotes}</TableCell>
            <TableCell className="px-6 py-4">
              {galpao._count.dispositivos}
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="flex items-center gap-1">
                <Button
                  aria-label={`Editar ${galpao.nome}`}
                  className="text-muted-foreground"
                  disabled
                  size="icon-sm"
                  title="Disponível em breve"
                  type="button"
                  variant="ghost"
                >
                  <Pencil aria-hidden="true" />
                </Button>
                <Button
                  aria-label={`Ver detalhes de ${galpao.nome}`}
                  className="text-muted-foreground"
                  disabled
                  size="icon-sm"
                  title="Disponível em breve"
                  type="button"
                  variant="ghost"
                >
                  <Eye aria-hidden="true" />
                </Button>
                <Button
                  aria-label={`Excluir ${galpao.nome}`}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onSolicitarExclusao(galpao)}
                  size="icon-sm"
                  title="Excluir"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

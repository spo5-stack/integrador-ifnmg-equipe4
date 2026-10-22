import { useId } from "react"
import type { FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { RequestError } from "@/components/feedback/RequestError"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ErrosDispositivo } from "@/features/dispositivos/model/dispositivo.validation"
import type { StatusRegistro } from "@/features/dispositivos/model/dispositivo.types"
import type { GalpaoOpcao } from "@/interfaces/galpao"
import { cn } from "@/lib/utils"

type DispositivoFormProps = {
  galpoes?: GalpaoOpcao[]
  galpaoId: string
  galpaoNome?: string
  bloquearGalpao?: boolean
  nome: string
  modelo: string
  status?: StatusRegistro
  showStatus?: boolean
  errors: ErrosDispositivo
  isSubmitting: boolean
  isLoadingGalpoes?: boolean
  erroGalpoes?: string | null
  onRetryGalpoes?: () => void
  submitLabel: string
  onChangeGalpao?: (valor: string) => void
  onChangeNome: (valor: string) => void
  onChangeModelo: (valor: string) => void
  onChangeStatus?: (valor: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  cancelHref: string
}

export function DispositivoForm({
  galpoes = [],
  galpaoId,
  galpaoNome,
  bloquearGalpao = false,
  nome,
  modelo,
  status = "ATIVO",
  showStatus = false,
  errors,
  isSubmitting,
  isLoadingGalpoes = false,
  erroGalpoes = null,
  onRetryGalpoes,
  submitLabel,
  onChangeGalpao,
  onChangeNome,
  onChangeModelo,
  onChangeStatus,
  onSubmit,
  cancelHref,
}: DispositivoFormProps) {
  const formId = useId()
  const galpaoIdField = `${formId}-galpao`
  const nomeId = `${formId}-nome`
  const modeloId = `${formId}-modelo`
  const statusId = `${formId}-status`
  const nomeErrorId = `${nomeId}-erro`
  const modeloErrorId = `${modeloId}-erro`
  const galpaoErrorId = `${galpaoIdField}-erro`
  const statusErrorId = `${statusId}-erro`

  const galpoesDoSelect = bloquearGalpao
    ? galpaoId
      ? [{ value: galpaoId, label: galpaoNome || galpaoId }]
      : []
    : galpoes.map((galpao) => ({ value: galpao.id, label: galpao.nome }))

  const formularioBloqueado =
    isSubmitting || isLoadingGalpoes || Boolean(erroGalpoes)

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}
    >
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-heading text-lg font-extrabold">
          Informações do Dispositivo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados do dispositivo.
        </p>
      </div>

      {errors.geral ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {errors.geral}
        </div>
      ) : null}

      {erroGalpoes && onRetryGalpoes ? (
        <RequestError message={erroGalpoes} onRetry={onRetryGalpoes} />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor={galpaoIdField}>Galpão</Label>
        <Select
          disabled={formularioBloqueado || bloquearGalpao}
          items={galpoesDoSelect}
          onValueChange={(valor) => onChangeGalpao?.(valor ?? "")}
          value={galpaoId || null}
        >
          <SelectTrigger
            aria-describedby={errors.galpaoId ? galpaoErrorId : undefined}
            aria-invalid={Boolean(errors.galpaoId)}
            className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
            id={galpaoIdField}
          >
            <SelectValue placeholder="Selecione um galpão" />
          </SelectTrigger>
          <SelectContent>
            {galpoesDoSelect.map((galpao) => (
              <SelectItem key={galpao.value} value={galpao.value}>
                {galpao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingGalpoes ? (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2
              aria-hidden="true"
              className="size-3 animate-spin motion-reduce:animate-none"
            />
            Carregando galpões...
          </p>
        ) : null}
        {errors.galpaoId ? (
          <p
            className="text-xs font-medium text-destructive"
            id={galpaoErrorId}
          >
            {errors.galpaoId}
          </p>
        ) : null}
        {!isLoadingGalpoes &&
        !erroGalpoes &&
        !bloquearGalpao &&
        galpoes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhum galpão disponível. Cadastre um galpão antes de adicionar um
            dispositivo.
          </p>
        ) : null}
        {bloquearGalpao ? (
          <p className="text-xs text-muted-foreground">
            O galpão de um dispositivo não pode ser alterado.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={nomeId}>Nome do Dispositivo</Label>
        <Input
          aria-describedby={errors.nome ? nomeErrorId : undefined}
          aria-invalid={Boolean(errors.nome)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id={nomeId}
          onChange={(event) => onChangeNome(event.target.value)}
          placeholder="Ex: Sensor LDR 01"
          type="text"
          value={nome}
        />
        {errors.nome ? (
          <p className="text-xs font-medium text-destructive" id={nomeErrorId}>
            {errors.nome}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={modeloId}>Modelo</Label>
        <Input
          aria-describedby={errors.modelo ? modeloErrorId : undefined}
          aria-invalid={Boolean(errors.modelo)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id={modeloId}
          onChange={(event) => onChangeModelo(event.target.value)}
          placeholder="Ex: LDR-5528"
          type="text"
          value={modelo}
        />
        {errors.modelo ? (
          <p
            className="text-xs font-medium text-destructive"
            id={modeloErrorId}
          >
            {errors.modelo}
          </p>
        ) : null}
      </div>

      {showStatus ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor={statusId}>Status</Label>
          <Select
            disabled={isSubmitting}
            onValueChange={(valor) => onChangeStatus?.(valor ?? "")}
            value={status}
          >
            <SelectTrigger
              aria-describedby={errors.status ? statusErrorId : undefined}
              aria-invalid={Boolean(errors.status)}
              className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
              id={statusId}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATIVO">ATIVO</SelectItem>
              <SelectItem value="DESATIVADO">DESATIVADO</SelectItem>
            </SelectContent>
          </Select>
          {errors.status ? (
            <p
              className="text-xs font-medium text-destructive"
              id={statusErrorId}
            >
              {errors.status}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-auto px-5 py-2.5"
          )}
          to={cancelHref}
        >
          Cancelar
        </Link>
        <Button
          aria-busy={isSubmitting}
          className="h-auto rounded-lg bg-primary px-6 py-2.5 font-heading text-sm font-bold text-primary-foreground"
          disabled={formularioBloqueado}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : null}
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

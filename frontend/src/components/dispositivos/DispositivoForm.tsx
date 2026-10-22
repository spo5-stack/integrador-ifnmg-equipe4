import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { Link } from "react-router-dom"
import type { GalpaoOpcao } from "@/interfaces/galpao"
import {
  dispositivoSchema,
  type CriarDispositivoFormValues,
  type DispositivoFormValues,
  type EditarDispositivoFormValues,
} from "@/components/dispositivos/dispositivoSchema"
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
import { cn } from "@/lib/utils"

const STATUS_OPCOES = ["ATIVO", "DESATIVADO"] as const

type DispositivoFormBaseProps = {
  galpaoId: string
  galpaoNome?: string
  bloquearGalpao?: boolean
  galpoes?: GalpaoOpcao[]
  isLoadingGalpoes?: boolean
  erroGalpoes?: string | null
  onRetryGalpoes?: () => void
  serverError?: string
  isSubmitting: boolean
  onFieldChange?: () => void
  cancelHref: string
  submitLabel: string
}

type CriarDispositivoFormProps = DispositivoFormBaseProps & {
  modo: "criar"
  onSubmit: (dados: CriarDispositivoFormValues) => void
}

type EditarDispositivoFormProps = DispositivoFormBaseProps & {
  modo: "editar"
  nomeInicial: string
  modeloInicial: string
  statusInicial: EditarDispositivoFormValues["status"]
  onSubmit: (dados: EditarDispositivoFormValues) => void
}

type DispositivoFormProps =
  CriarDispositivoFormProps | EditarDispositivoFormProps

export function DispositivoForm(props: DispositivoFormProps) {
  const {
    galpaoId,
    galpaoNome,
    bloquearGalpao = false,
    galpoes = [],
    isLoadingGalpoes = false,
    erroGalpoes = null,
    onRetryGalpoes,
    serverError,
    isSubmitting,
    onFieldChange,
    cancelHref,
    submitLabel,
    modo,
  } = props

  const ehEdicao = modo === "editar"

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DispositivoFormValues>({
    resolver: zodResolver(dispositivoSchema),
    defaultValues: {
      galpaoId,
      nome: ehEdicao ? props.nomeInicial : "",
      modelo: ehEdicao ? props.modeloInicial : "",
      status: ehEdicao ? props.statusInicial : "ATIVO",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const galpaoSelecionado = useWatch({ control, name: "galpaoId" })
  const statusSelecionado = useWatch({ control, name: "status" })

  const galpoesDoSelect = bloquearGalpao
    ? galpaoId
      ? [{ value: galpaoId, label: galpaoNome || galpaoId }]
      : []
    : galpoes.map((galpao) => ({ value: galpao.id, label: galpao.nome }))

  const formularioBloqueado =
    isSubmitting || isLoadingGalpoes || Boolean(erroGalpoes)

  function enviar(valores: DispositivoFormValues): void {
    if (ehEdicao) {
      props.onSubmit(valores)
      return
    }

    props.onSubmit({
      galpaoId: valores.galpaoId,
      nome: valores.nome,
      modelo: valores.modelo,
    })
  }

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit(enviar)}
    >
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-heading text-lg font-extrabold">
          Informações do Dispositivo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados do dispositivo.
        </p>
      </div>

      {serverError ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      {erroGalpoes && onRetryGalpoes ? (
        <RequestError message={erroGalpoes} onRetry={onRetryGalpoes} />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="dispositivo-galpao">Galpão</Label>
        <Select
          disabled={formularioBloqueado || bloquearGalpao}
          items={galpoesDoSelect}
          onValueChange={(valor) => {
            setValue("galpaoId", valor ?? "", { shouldValidate: true })
            onFieldChange?.()
          }}
          value={galpaoSelecionado || null}
        >
          <SelectTrigger
            aria-describedby={
              errors.galpaoId ? "dispositivo-galpao-erro" : undefined
            }
            aria-invalid={Boolean(errors.galpaoId)}
            className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
            id="dispositivo-galpao"
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
            id="dispositivo-galpao-erro"
          >
            {errors.galpaoId.message}
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
        <Label htmlFor="dispositivo-nome">Nome do Dispositivo</Label>
        <Input
          {...register("nome", { onChange: () => onFieldChange?.() })}
          aria-describedby={errors.nome ? "dispositivo-nome-erro" : undefined}
          aria-invalid={Boolean(errors.nome)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="dispositivo-nome"
          placeholder="Ex: Sensor LDR 01"
          type="text"
        />
        {errors.nome ? (
          <p
            className="text-xs font-medium text-destructive"
            id="dispositivo-nome-erro"
          >
            {errors.nome.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dispositivo-modelo">Modelo</Label>
        <Input
          {...register("modelo", { onChange: () => onFieldChange?.() })}
          aria-describedby={
            errors.modelo ? "dispositivo-modelo-erro" : undefined
          }
          aria-invalid={Boolean(errors.modelo)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="dispositivo-modelo"
          placeholder="Ex: LDR-5528"
          type="text"
        />
        {errors.modelo ? (
          <p
            className="text-xs font-medium text-destructive"
            id="dispositivo-modelo-erro"
          >
            {errors.modelo.message}
          </p>
        ) : null}
      </div>

      {ehEdicao ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="dispositivo-status">Status</Label>
          <Select
            disabled={isSubmitting}
            items={STATUS_OPCOES.map((status) => ({
              value: status,
              label: status,
            }))}
            onValueChange={(valor) => {
              setValue(
                "status",
                valor as EditarDispositivoFormValues["status"],
                {
                  shouldValidate: true,
                }
              )
              onFieldChange?.()
            }}
            value={statusSelecionado}
          >
            <SelectTrigger
              aria-describedby={
                errors.status ? "dispositivo-status-erro" : undefined
              }
              aria-invalid={Boolean(errors.status)}
              className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
              id="dispositivo-status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPCOES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status ? (
            <p
              className="text-xs font-medium text-destructive"
              id="dispositivo-status-erro"
            >
              {errors.status.message}
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

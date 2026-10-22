import { Loader2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { Link } from "react-router-dom"
import type { GalpaoOpcao } from "@/interfaces/galpao"
import {
  loteResolver,
  mensagemCapacidade,
  obterDataHojeLocal,
  type LoteFormValues,
} from "@/components/lotes/loteSchema"
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

type CadastrarLoteFormProps = {
  galpoes: GalpaoOpcao[]
  galpaoIdInicial?: string
  isLoadingGalpoes: boolean
  erroGalpoes: string | null
  serverError?: string
  isSubmitting: boolean
  onRetryGalpoes: () => void
  onFieldChange?: () => void
  onSubmit: (dados: LoteFormValues) => void
  cancelHref: string
}

export function CadastrarLoteForm({
  galpoes,
  galpaoIdInicial,
  isLoadingGalpoes,
  erroGalpoes,
  serverError,
  isSubmitting,
  onRetryGalpoes,
  onFieldChange,
  onSubmit,
  cancelHref,
}: CadastrarLoteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoteFormValues>({
    resolver: loteResolver,
    defaultValues: {
      galpaoId: galpaoIdInicial ?? "",
      quantidade: "",
      dataInicio: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const galpaoId = useWatch({ control, name: "galpaoId" })
  const capacidadeGalpao =
    galpoes.find((galpao) => galpao.id === galpaoId)?.capacidade ?? null

  const formularioBloqueado =
    isSubmitting || isLoadingGalpoes || Boolean(erroGalpoes)

  function enviar(dados: LoteFormValues): void {
    const mensagem = mensagemCapacidade(dados.quantidade, capacidadeGalpao)

    if (mensagem) {
      setError("quantidade", { type: "custom", message: mensagem })
      return
    }

    onSubmit(dados)
  }

  return (
    <form
      aria-busy={isSubmitting}
      className="flex flex-col gap-6"
      noValidate
      onSubmit={handleSubmit((dados) => enviar(dados))}
    >
      <div className="border-b border-border/60 pb-5">
        <h2 className="font-heading text-lg font-extrabold">
          Informações do Lote
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe o galpão, a quantidade de aves e a data de início.
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

      {erroGalpoes ? (
        <RequestError message={erroGalpoes} onRetry={onRetryGalpoes} />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="lote-galpao">Galpão</Label>
        <Select
          disabled={formularioBloqueado}
          items={galpoes.map((galpao) => ({
            value: galpao.id,
            label: galpao.nome,
          }))}
          onValueChange={(valor) => {
            setValue("galpaoId", valor ?? "", { shouldValidate: true })
            onFieldChange?.()
          }}
          value={galpaoId || null}
        >
          <SelectTrigger
            aria-describedby={errors.galpaoId ? "lote-galpao-erro" : undefined}
            aria-invalid={Boolean(errors.galpaoId)}
            className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
            id="lote-galpao"
          >
            <SelectValue placeholder="Selecione o galpão" />
          </SelectTrigger>
          <SelectContent>
            {galpoes.map((galpao) => (
              <SelectItem key={galpao.id} value={galpao.id}>
                {galpao.nome}
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
            id="lote-galpao-erro"
          >
            {errors.galpaoId.message}
          </p>
        ) : null}
        {!isLoadingGalpoes && !erroGalpoes && galpoes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhum galpão disponível. Cadastre um galpão antes de criar um lote.
          </p>
        ) : null}
        {capacidadeGalpao !== null ? (
          <p className="text-xs text-muted-foreground">
            Capacidade do galpão: {capacidadeGalpao.toLocaleString("pt-BR")}{" "}
            aves.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lote-quantidade">Quantidade de Aves</Label>
        <Input
          {...register("quantidade", { onChange: () => onFieldChange?.() })}
          aria-describedby={
            errors.quantidade ? "lote-quantidade-erro" : undefined
          }
          aria-invalid={Boolean(errors.quantidade)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="lote-quantidade"
          inputMode="numeric"
          max={capacidadeGalpao ?? undefined}
          min="1"
          placeholder="0"
          step="1"
          type="number"
        />
        {errors.quantidade ? (
          <p
            className="text-xs font-medium text-destructive"
            id="lote-quantidade-erro"
          >
            {errors.quantidade.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lote-data">Data de Início</Label>
        <Input
          {...register("dataInicio", { onChange: () => onFieldChange?.() })}
          aria-describedby={errors.dataInicio ? "lote-data-erro" : undefined}
          aria-invalid={Boolean(errors.dataInicio)}
          className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
          id="lote-data"
          max={obterDataHojeLocal()}
          type="date"
        />
        {errors.dataInicio ? (
          <p
            className="text-xs font-medium text-destructive"
            id="lote-data-erro"
          >
            {errors.dataInicio.message}
          </p>
        ) : null}
      </div>

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
          {isSubmitting ? "Salvando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  )
}

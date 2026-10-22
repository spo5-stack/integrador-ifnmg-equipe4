import { useId } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
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
import { useCadastrarLoteForm } from "@/features/lotes/controller/useCadastrarLoteForm"
import { obterDataHojeLocal } from "@/features/lotes/model/lote.validation"
import { cn } from "@/lib/utils"

export function CadastrarLoteView() {
  const { galpaoId } = useParams<{ galpaoId: string }>()
  const {
    galpoes,
    galpaoId: galpaoSelecionado,
    quantidade,
    dataInicio,
    errors,
    capacidadeGalpao,
    isLoadingGalpoes,
    erroGalpoes,
    isSubmitting,
    onChangeGalpao,
    onChangeQuantidade,
    onChangeDataInicio,
    recarregarGalpoes,
    onSubmit,
  } = useCadastrarLoteForm(galpaoId)
  const formId = useId()
  const galpaoSelId = `${formId}-galpao`
  const quantidadeId = `${formId}-quantidade`
  const dataId = `${formId}-data`
  const quantidadeErrorId = `${quantidadeId}-erro`
  const dataErrorId = `${dataId}-erro`
  const galpaoErrorId = `${galpaoSelId}-erro`
  const capacidadeId = `${quantidadeId}-capacidade`

  const voltarPara = galpaoId
    ? `/galpoes/${encodeURIComponent(galpaoId)}`
    : "/galpoes"
  const formularioBloqueado =
    isSubmitting || isLoadingGalpoes || Boolean(erroGalpoes)

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
        <form
          aria-busy={isSubmitting}
          className="flex flex-col gap-6"
          noValidate
          onSubmit={(event) => void onSubmit(event)}
        >
          <div className="border-b border-border/60 pb-5">
            <h2 className="font-heading text-lg font-extrabold">
              Informações do Lote
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informe o galpão, a quantidade de aves e a data de início.
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

          {erroGalpoes ? (
            <RequestError message={erroGalpoes} onRetry={recarregarGalpoes} />
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor={galpaoSelId}>Galpão</Label>
            <Select
              disabled={formularioBloqueado}
              items={galpoes.map((galpao) => ({
                value: galpao.id,
                label: galpao.nome,
              }))}
              onValueChange={(valor) => onChangeGalpao(valor ?? "")}
              value={galpaoSelecionado || null}
            >
              <SelectTrigger
                aria-describedby={
                  errors.galpaoId
                    ? galpaoErrorId
                    : capacidadeGalpao !== null
                      ? capacidadeId
                      : undefined
                }
                aria-invalid={Boolean(errors.galpaoId)}
                className="h-auto w-full border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
                id={galpaoSelId}
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
                id={galpaoErrorId}
              >
                {errors.galpaoId}
              </p>
            ) : null}
            {!isLoadingGalpoes && !erroGalpoes && galpoes.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum galpão disponível. Cadastre um galpão antes de criar um
                lote.
              </p>
            ) : null}
            {capacidadeGalpao !== null ? (
              <p className="text-xs text-muted-foreground" id={capacidadeId}>
                Capacidade do galpão: {capacidadeGalpao.toLocaleString("pt-BR")}{" "}
                aves.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={quantidadeId}>Quantidade de Aves</Label>
            <Input
              aria-describedby={
                errors.quantidade
                  ? quantidadeErrorId
                  : capacidadeGalpao !== null
                    ? capacidadeId
                    : undefined
              }
              aria-invalid={Boolean(errors.quantidade)}
              className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
              id={quantidadeId}
              inputMode="numeric"
              max={capacidadeGalpao ?? undefined}
              min="1"
              onChange={(event) => onChangeQuantidade(event.target.value)}
              placeholder="0"
              step="1"
              type="number"
              value={quantidade}
            />
            {errors.quantidade ? (
              <p
                className="text-xs font-medium text-destructive"
                id={quantidadeErrorId}
              >
                {errors.quantidade}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={dataId}>Data de Início</Label>
            <Input
              aria-describedby={errors.dataInicio ? dataErrorId : undefined}
              aria-invalid={Boolean(errors.dataInicio)}
              className="h-auto rounded-lg border-input bg-muted px-4 py-3 text-sm focus-visible:ring-2"
              id={dataId}
              max={obterDataHojeLocal()}
              onChange={(event) => onChangeDataInicio(event.target.value)}
              type="date"
              value={dataInicio}
            />
            {errors.dataInicio ? (
              <p
                className="text-xs font-medium text-destructive"
                id={dataErrorId}
              >
                {errors.dataInicio}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto px-5 py-2.5"
              )}
              to={voltarPara}
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
      </section>
    </div>
  )
}

import { useState } from "react"
import { ArrowLeft, Copy } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCriarDispositivoForm } from "@/features/dispositivos/controller/useCriarDispositivoForm"
import { DispositivoForm } from "@/features/dispositivos/view/DispositivoForm"
import { cn } from "@/lib/utils"

export function CriarDispositivoView() {
  const { galpaoId } = useParams<{ galpaoId: string }>()
  const navigate = useNavigate()
  const [copiado, setCopiado] = useState(false)
  const [erroCopia, setErroCopia] = useState<string | null>(null)
  const {
    galpoes,
    galpaoId: galpaoSelecionado,
    nome,
    modelo,
    errors,
    isLoadingGalpoes,
    erroGalpoes,
    isSubmitting,
    dispositivoCriadoId,
    galpaoCriadoId,
    onChangeGalpao,
    onChangeNome,
    onChangeModelo,
    recarregarGalpoes,
    onSubmit,
  } = useCriarDispositivoForm(galpaoId)

  async function copiarId(): Promise<void> {
    if (!dispositivoCriadoId) return

    try {
      await navigator.clipboard.writeText(dispositivoCriadoId)
      setCopiado(true)
      setErroCopia(null)
    } catch {
      setCopiado(false)
      setErroCopia(
        "Não foi possível copiar o ID. Selecione o texto e copie manualmente."
      )
    }
  }

  function irParaGalpao(): void {
    const destino = galpaoCriadoId || galpaoId || galpaoSelecionado
    if (destino) {
      navigate(`/galpoes/${encodeURIComponent(destino)}`, {
        state: { sucesso: "Dispositivo cadastrado com sucesso." },
      })
    } else {
      navigate("/galpoes", {
        state: { sucesso: "Dispositivo cadastrado com sucesso." },
      })
    }
  }

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
          Novo Dispositivo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre um novo dispositivo no galpão.
        </p>
      </header>

      <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <DispositivoForm
          cancelHref={voltarPara}
          erroGalpoes={erroGalpoes}
          errors={errors}
          galpaoId={galpaoSelecionado}
          galpoes={galpoes}
          isLoadingGalpoes={isLoadingGalpoes}
          isSubmitting={isSubmitting}
          modelo={modelo}
          nome={nome}
          onChangeGalpao={onChangeGalpao}
          onChangeModelo={onChangeModelo}
          onChangeNome={onChangeNome}
          onRetryGalpoes={recarregarGalpoes}
          onSubmit={(event) => void onSubmit(event)}
          submitLabel="Salvar"
        />
      </section>

      <Dialog
        onOpenChange={(aberto) => {
          if (!aberto) irParaGalpao()
        }}
        open={Boolean(dispositivoCriadoId)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-extrabold">
              Dispositivo criado com sucesso
            </DialogTitle>
            <DialogDescription>
              Guarde o ID para configurar o envio de leituras do gateway.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium"
              htmlFor="dispositivo-criado-id"
            >
              ID do dispositivo
            </label>
            <Input
              aria-describedby={
                copiado || erroCopia ? "dispositivo-copia-status" : undefined
              }
              className="h-auto rounded-lg border-input bg-muted px-3 py-2 font-mono text-sm"
              id="dispositivo-criado-id"
              onFocus={(event) => event.currentTarget.select()}
              readOnly
              value={dispositivoCriadoId ?? ""}
            />
            <p
              aria-live="polite"
              className={cn(
                "min-h-4 text-xs",
                erroCopia ? "text-destructive" : "text-muted-foreground"
              )}
              id="dispositivo-copia-status"
              role={erroCopia ? "alert" : "status"}
            >
              {erroCopia ?? (copiado ? "ID copiado." : "")}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              className="h-auto"
              onClick={() => void copiarId()}
              type="button"
              variant="outline"
            >
              <Copy aria-hidden="true" />
              Copiar ID
            </Button>
            <Button
              className="h-auto bg-primary text-primary-foreground"
              onClick={irParaGalpao}
              type="button"
            >
              Ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

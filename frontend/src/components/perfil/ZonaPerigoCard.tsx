import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
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

type ZonaPerigoCardProps = {
  isSubmitting: boolean
  erro?: string
  onConfirmar: () => void
}

export function ZonaPerigoCard({
  isSubmitting,
  erro,
  onConfirmar,
}: ZonaPerigoCardProps) {
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h2 className="font-heading text-lg font-extrabold">Zona de Perigo</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Excluir sua conta remove todos os dados permanentemente.
      </p>

      {erro ? (
        <div
          className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {erro}
        </div>
      ) : null}

      <div className="mt-4">
        <Button
          className="h-auto px-6 py-2.5 font-heading text-sm font-bold"
          disabled={isSubmitting}
          onClick={() => setConfirmacaoAberta(true)}
          type="button"
          variant="destructive"
        >
          <Trash2 aria-hidden="true" />
          Excluir Conta
        </Button>
      </div>

      <AlertDialog
        onOpenChange={(aberto) => {
          if (!aberto && !isSubmitting) setConfirmacaoAberta(false)
        }}
        open={confirmacaoAberta}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Todos os seus galpões, lotes,
              dispositivos e leituras serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={() => onConfirmar()}
              variant="destructive"
            >
              {isSubmitting ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              {isSubmitting ? "Excluindo..." : "Excluir Conta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

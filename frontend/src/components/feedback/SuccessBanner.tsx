import { CircleCheck, X } from "lucide-react"

type SuccessBannerProps = {
  message: string
  onDismiss: () => void
}

export function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <div
      className="flex min-w-0 items-start gap-3 rounded-lg border border-secondary-foreground/20 bg-secondary/40 px-4 py-3 text-sm text-secondary-foreground"
      role="status"
    >
      <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="min-w-0 flex-1 font-medium break-words">{message}</p>
      <button
        aria-label="Fechar mensagem de sucesso"
        className="shrink-0 rounded-md p-1 transition-colors hover:bg-secondary-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

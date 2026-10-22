import { Button } from "@/components/ui/button"

type RequestErrorProps = {
  message: string
  onRetry: () => void
}

export function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <span className="font-medium">{message}</span>
      <Button
        className="w-full border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
        onClick={onRetry}
        size="sm"
        type="button"
        variant="outline"
      >
        Tentar novamente
      </Button>
    </div>
  )
}

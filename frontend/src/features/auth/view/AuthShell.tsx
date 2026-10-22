import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  children: ReactNode
  className?: string
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-svh w-full items-center justify-center bg-muted p-4 sm:p-6",
        className
      )}
    >
      {children}
    </main>
  )
}

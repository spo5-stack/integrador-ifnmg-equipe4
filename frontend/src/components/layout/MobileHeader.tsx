import { NavLink } from "react-router-dom"
import { LogOut, SunMedium } from "lucide-react"
import { navItems } from "@/components/layout/navigation"
import { useAuth } from "@/features/auth/controller/AuthContext"
import { cn } from "@/lib/utils"

export function MobileHeader() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <SunMedium aria-hidden="true" className="size-4" />
        </div>
        <span className="truncate font-heading text-sm font-extrabold">
          Granja Inteligente
        </span>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex shrink-0 items-center gap-1"
      >
        {navItems
          .filter((item) => item.to)
          .map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(
                    "grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )
                }
                end={item.to === "/"}
                key={item.label}
                title={item.label}
                to={item.to ?? "/"}
              >
                <Icon aria-hidden="true" className="size-5" />
              </NavLink>
            )
          })}
        <button
          aria-label="Sair"
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={logout}
          title="Sair"
          type="button"
        >
          <LogOut aria-hidden="true" className="size-5" />
        </button>
      </nav>
    </header>
  )
}

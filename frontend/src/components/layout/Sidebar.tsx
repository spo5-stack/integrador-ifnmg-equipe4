import { NavLink } from "react-router-dom"
import { LogOut, Settings, SunMedium } from "lucide-react"
import { navItems } from "@/components/layout/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-sidebar py-6 text-sidebar-foreground md:flex">
      <div className="mb-8 flex items-center gap-3 px-6">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <SunMedium aria-hidden="true" className="size-5" />
        </div>
        <h1 className="font-heading text-lg leading-tight font-extrabold">
          Granja Inteligente
        </h1>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex flex-1 flex-col gap-1 px-3"
      >
        {navItems
          .filter((item) => Boolean(item.to))
          .map((item) => {
            const Icon = item.icon
            const to = item.to as string

            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 font-heading text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )
                }
                end={to === "/"}
                key={item.label}
                to={to}
              >
                <Icon aria-hidden="true" className="size-5" />
                {item.label}
              </NavLink>
            )
          })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-3">
        <NavLink
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 font-heading text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )
          }
          to="/perfil"
        >
          <Settings aria-hidden="true" className="size-5" />
          Configurações
        </NavLink>
        <button
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-left font-heading text-sm font-semibold text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={logout}
          type="button"
        >
          <LogOut aria-hidden="true" className="size-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}

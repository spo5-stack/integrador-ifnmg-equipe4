import { CirclePlus, LayoutDashboard, Warehouse } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  label: string
  icon: LucideIcon
  to?: string
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Cadastrar Lote", icon: CirclePlus, to: "/lotes/novo" },
  { label: "Galpões", icon: Warehouse, to: "/galpoes" },
]

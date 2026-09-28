import { LayoutDashboard, List, Plus, User, Wallet, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const LEFT_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/operations", label: "Opérations", icon: List },
]

const RIGHT_ITEMS: NavItem[] = [
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/profil", label: "Profil", icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-16 items-center justify-around border-t border-border bg-card md:hidden">
      {LEFT_ITEMS.map((item) => (
        <BottomNavLink key={item.to} {...item} />
      ))}
      <NavLink
        to="/operations/nouveau"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
        aria-label="Ajouter une opération"
      >
        <Plus className="size-6" />
      </NavLink>
      {RIGHT_ITEMS.map((item) => (
        <BottomNavLink key={item.to} {...item} />
      ))}
    </nav>
  )
}

function BottomNavLink({ to, label, icon: Icon }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn("flex flex-col items-center gap-1 text-2xs text-muted-foreground", isActive && "text-primary")
      }
    >
      <Icon className="size-6" />
      {label}
    </NavLink>
  )
}

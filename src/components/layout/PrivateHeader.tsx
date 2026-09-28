import { NavLink } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/operations", label: "Opérations" },
  { to: "/budgets", label: "Budgets" },
  { to: "/categories", label: "Catégories" },
  { to: "/statistiques", label: "Statistiques" },
]

export function PrivateHeader() {
  const { logout } = useAuth()

  return (
    <header className="hidden h-16 border-b border-border bg-card md:block">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <NavLink to="/dashboard" className="text-lg font-semibold text-primary">
          Budget Perso
        </NavLink>
        <nav className="flex h-full items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex h-full items-center border-b-2 border-transparent px-3 text-base text-muted-foreground",
                  isActive && "border-primary font-semibold text-primary",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <NavLink to="/profil" className="hover:text-primary">
            Profil
          </NavLink>
          <button type="button" onClick={() => logout()} className="hover:text-primary">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}

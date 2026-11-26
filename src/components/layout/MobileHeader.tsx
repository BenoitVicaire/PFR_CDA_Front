import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

// Entrées absentes de BottomNav : sans ce menu elles sont inaccessibles sur mobile (ENF-C02).
const MENU_ITEMS = [
  { to: "/categories", label: "Catégories" },
  { to: "/statistiques", label: "Statistiques" },
  { to: "/profil", label: "Profil" },
]

export function MobileHeader() {
  const { logout } = useAuth()

  return (
    <header className="flex h-14 items-center border-b border-border bg-card px-2 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
            <Menu className="size-6 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem key={item.to} asChild>
              <Link to={item.to}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => logout()}>Déconnexion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link to="/dashboard" className="flex-1 text-center text-lg font-medium text-primary">
        Budget Perso
      </Link>
      {/* Contrepoids du bouton menu, pour centrer le titre. */}
      <div className="size-9" aria-hidden="true" />
    </header>
  )
}

import { Outlet } from "react-router-dom"

import { PublicFooter } from "./PublicFooter"

/** Connexion et inscription : le formulaire occupe la hauteur disponible, les liens légaux sont en bas (EF-G02). */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

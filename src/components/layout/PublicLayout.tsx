import { Link, Outlet } from "react-router-dom"

import { PublicFooter } from "./PublicFooter"

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link to="/" className="text-lg font-semibold text-primary">
            Budget Perso
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

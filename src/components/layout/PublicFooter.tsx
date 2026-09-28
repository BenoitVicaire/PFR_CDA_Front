import { Link } from "react-router-dom"

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <nav className="flex gap-4">
          <Link to="/mentions-legales" className="hover:text-primary">
            Mentions légales
          </Link>
          <Link to="/politique-confidentialite" className="hover:text-primary">
            Politique de confidentialité
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} Budget Perso</p>
      </div>
    </footer>
  )
}

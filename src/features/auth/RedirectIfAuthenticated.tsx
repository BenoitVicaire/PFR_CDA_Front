import { Navigate, Outlet, useSearchParams } from "react-router-dom"

import { getRedirectPath } from "@/features/auth/redirect"
import { useAuth } from "@/hooks/useAuth"

export function RedirectIfAuthenticated() {
  const { user, loading, registering } = useAuth()
  const [searchParams] = useSearchParams()

  if (loading) return null
  // On attend la fin de l'inscription (nom et catégories) avant de quitter la page.
  // Dès la connexion, cette redirection passe avant celle de LoginPage : elle doit viser la même page.
  if (user && !registering) return <Navigate to={getRedirectPath(searchParams)} replace />

  return <Outlet />
}

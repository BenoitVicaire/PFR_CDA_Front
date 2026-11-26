import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"

export function RedirectIfAuthenticated() {
  const { user, loading, registering } = useAuth()

  if (loading) return null
  // On attend la fin de l'inscription (nom et catégories) avant de quitter la page.
  if (user && !registering) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

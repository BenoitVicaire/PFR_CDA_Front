import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"

export function LogoutPage() {
  const { logout } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    logout().finally(() => setDone(true))
  }, [logout])

  if (!done) return null

  return <Navigate to="/" replace />
}

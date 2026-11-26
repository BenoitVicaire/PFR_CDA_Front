import { useEffect, useState, type ReactNode } from "react"

import { firebaseAuthService } from "@/services/firebase/auth.service"
import type { User } from "@/types"

import { AuthContext, type AuthContextValue } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    return firebaseAuthService.onAuthStateChanged((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  async function register(email: string, password: string, displayName: string) {
    setRegistering(true)
    try {
      // onAuthStateChanged ne se redéclenche pas quand le nom est ajouté : on le reprend ici.
      setUser(await firebaseAuthService.register(email, password, displayName))
    } finally {
      setRegistering(false)
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    registering,
    login: firebaseAuthService.login,
    register,
    logout: firebaseAuthService.logout,
    sendPasswordReset: firebaseAuthService.sendPasswordReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

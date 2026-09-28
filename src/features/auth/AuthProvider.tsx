import { useEffect, useState, type ReactNode } from "react"

import { firebaseAuthService } from "@/services/firebase/auth.service"
import type { User } from "@/types"

import { AuthContext, type AuthContextValue } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return firebaseAuthService.onAuthStateChanged((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    login: firebaseAuthService.login,
    register: firebaseAuthService.register,
    logout: firebaseAuthService.logout,
    sendPasswordReset: firebaseAuthService.sendPasswordReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

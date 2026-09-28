import { createContext } from "react"

import type { User } from "@/types"

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

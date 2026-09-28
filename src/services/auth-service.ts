import type { User } from "@/types"

export interface AuthService {
  onAuthStateChanged(callback: (user: User | null) => void): () => void
  register(email: string, password: string, displayName: string): Promise<void>
  login(email: string, password: string, options?: { rememberMe?: boolean }): Promise<void>
  logout(): Promise<void>
  sendPasswordReset(email: string): Promise<void>
}

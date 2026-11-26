import type { User } from "@/types"

export interface AuthService {
  onAuthStateChanged(callback: (user: User | null) => void): () => void
  /**
   * Crée le compte, son nom et ses catégories par défaut (US-001, EF-C02).
   * Tout ou rien : en cas d'échec après la création, le compte est supprimé pour pouvoir réessayer.
   */
  register(email: string, password: string, displayName: string): Promise<User>
  login(email: string, password: string, options?: { rememberMe?: boolean }): Promise<void>
  logout(): Promise<void>
  sendPasswordReset(email: string): Promise<void>
}

import { FirebaseError } from "firebase/app"

import { seedDefaultCategories } from "@/features/categories/seed-default-categories"
import type { AuthService } from "@/services/auth-service"
import type { User } from "@/types"

import { firebaseCategoryService } from "./category.service"
import { DEMO_USER } from "./seed"
import { nextId } from "./store"

interface Account {
  user: User
  password: string
}

const accounts = new Map<string, Account>([
  [
    DEMO_USER.email,
    {
      password: DEMO_USER.password,
      user: { id: DEMO_USER.id, email: DEMO_USER.email, displayName: DEMO_USER.displayName, currency: "EUR" },
    },
  ],
])

const listeners = new Set<(user: User | null) => void>()
let currentUser: User | null = null

function setCurrentUser(user: User | null) {
  currentUser = user
  listeners.forEach((listener) => listener(user))
}

/**
 * Implémentation en mémoire de {@link AuthService} pour les tests de bout en bout.
 * Le compte de démonstration est défini dans `seed.ts`. Les erreurs reprennent les codes Firebase
 * pour que `toAuthErrorMessage` produise les mêmes messages qu'en production.
 */
export const firebaseAuthService: AuthService = {
  onAuthStateChanged(callback) {
    listeners.add(callback)
    queueMicrotask(() => callback(currentUser))
    return () => {
      listeners.delete(callback)
    }
  },

  async register(email, password, displayName) {
    if (accounts.has(email)) {
      throw new FirebaseError("auth/email-already-in-use", "Email already in use")
    }
    const user: User = { id: nextId("user"), email, displayName, currency: "EUR" }
    accounts.set(email, { user, password })
    await seedDefaultCategories(firebaseCategoryService, user.id)
    setCurrentUser(user)
  },

  async login(email, password) {
    const account = accounts.get(email)
    if (!account || account.password !== password) {
      throw new FirebaseError("auth/invalid-credential", "Invalid credential")
    }
    setCurrentUser(account.user)
  },

  async logout() {
    setCurrentUser(null)
  },

  async sendPasswordReset() {},
}

import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"

import { seedDefaultCategories } from "@/features/categories/seed-default-categories"
import { auth } from "@/lib/firebase"
import type { AuthService } from "@/services/auth-service"
import { firebaseCategoryService } from "@/services/firebase/category.service"
import type { User } from "@/types"

function toUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? "",
    currency: "EUR",
  }
}

export const firebaseAuthService: AuthService = {
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? toUser(firebaseUser) : null)
    })
  },

  async register(email, password, displayName) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName })
    await seedDefaultCategories(firebaseCategoryService, credential.user.uid)
  },

  async login(email, password, options) {
    const persistence = options?.rememberMe === false ? browserSessionPersistence : browserLocalPersistence
    await setPersistence(auth, persistence)
    await signInWithEmailAndPassword(auth, email, password)
  },

  async logout() {
    await signOut(auth)
  },

  async sendPasswordReset(email) {
    await sendPasswordResetEmail(auth, email)
  },
}

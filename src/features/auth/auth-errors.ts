import { FirebaseError } from "firebase/app"

export function toAuthErrorMessage(error: unknown, context: "register" | "login"): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Cette adresse email est déjà utilisée."
      case "auth/invalid-email":
        return "Adresse email invalide."
      case "auth/weak-password":
        return "Mot de passe trop faible."
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessayez dans quelques minutes."
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        // EF-A02 : message générique, ne jamais révéler quel champ est faux.
        return context === "login" ? "Email ou mot de passe incorrect." : "Une erreur est survenue."
    }
  }
  return "Une erreur est survenue, réessayez."
}

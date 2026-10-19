import { createDemoData, createEmptyData, DEMO_USER, type UserData } from "./seed"

const dataByUser = new Map<string, UserData>()
let sequence = 0

/**
 * Renvoie les données en mémoire d'un utilisateur, en les initialisant à la première lecture.
 * Le compte de démonstration reçoit le jeu de données complet, les autres un espace vide.
 * Les données vivent le temps du chargement de la page : un rechargement les réinitialise.
 */
export function getUserData(userId: string): UserData {
  let data = dataByUser.get(userId)
  if (!data) {
    data = userId === DEMO_USER.id ? createDemoData() : createEmptyData()
    dataByUser.set(userId, data)
  }
  return data
}

/** Génère un identifiant unique, à la manière d'un identifiant de document Firestore. */
export function nextId(prefix: string): string {
  sequence += 1
  return `${prefix}-${sequence}`
}

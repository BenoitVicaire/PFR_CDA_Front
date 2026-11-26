// Dates en heure locale : toISOString() renvoie la date UTC, fausse entre minuit et 2 h en France.

/** Date au format "YYYY-MM-DD", en heure locale. */
export function toLocalDate(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

/** Mois au format "YYYY-MM", en heure locale. */
export function toLocalMonth(date: Date = new Date()): string {
  return toLocalDate(date).slice(0, 7)
}

// src/lib/format.ts
const CURRENCY = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

/**
 * Formate un montant en centimes en euros, à la française (ex. 123456 → "1 234,56 €").
 *
 * @param cents - Le montant en centimes (entier)
 */
export function formatCents(cents: number): string {
  return CURRENCY.format(cents / 100)
}
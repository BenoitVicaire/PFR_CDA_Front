// src/lib/format.ts
const CURRENCY = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export function formatCents(cents: number): string {
  return CURRENCY.format(cents / 100)
}
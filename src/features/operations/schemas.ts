import { z } from "zod"

import { toLocalDate } from "@/lib/date"

function shiftYears(years: number) {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return toLocalDate(date)
}

export const MIN_DATE = shiftYears(-5)
export const MAX_DATE = shiftYears(5)

// EF-B01 : montant > 0, ≤ 2 décimales ; date ±5 ans (support prévisionnel).
export const operationSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce
    .number({ message: "Montant requis" })
    .positive("Le montant doit être supérieur à zéro")
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6, "2 décimales maximum"),
  // Au format "YYYY-MM-DD", l'ordre alphabétique est l'ordre chronologique.
  // Le format est vérifié d'abord : un champ date accepte une année à 6 chiffres.
  date: z
    .string()
    .min(1, "Date requise")
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= MIN_DATE && value <= MAX_DATE,
      "La date doit être à 5 ans près d'aujourd'hui"
    ),
  categoryId: z.string().min(1, "Catégorie requise"),
  label: z.string().max(200, "200 caractères maximum").optional(),
})

export type OperationFormInput = z.input<typeof operationSchema>
export type OperationFormValues = z.output<typeof operationSchema>

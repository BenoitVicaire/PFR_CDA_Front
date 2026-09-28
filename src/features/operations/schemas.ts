import { z } from "zod"

// EF-B01 : montant > 0, ≤ 2 décimales ; date ±5 ans (support prévisionnel).
export const operationSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce
    .number({ message: "Montant requis" })
    .positive("Le montant doit être supérieur à zéro")
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6, "2 décimales maximum"),
  date: z.string().min(1, "Date requise"),
  categoryId: z.string().min(1, "Catégorie requise"),
  label: z.string().max(200, "200 caractères maximum").optional(),
})

export type OperationFormInput = z.input<typeof operationSchema>
export type OperationFormValues = z.output<typeof operationSchema>

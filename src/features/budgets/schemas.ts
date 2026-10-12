import { z } from "zod"

export const budgetSchema = z.object({
	categoryId: z.string().min(1, "Catégorie requise"),
	month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mois invalide"),
	amount: z.coerce
		.number({message:"Montant requis"})
		.positive("Le montant doit être supérieur à zéro")
		.refine((value)=> Math.abs(value*100 - Math.round(value*100))< 1e-6, "2 décimales maximum"),
})


export type BudgetFormInput = z.input<typeof budgetSchema>
export type BudgetFormValues = z.output<typeof budgetSchema>

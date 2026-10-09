import type { Category } from "./category"

export interface Budget {
  id: string
  categoryId: string
  month: string
  capCents: number
}

export type BudgetStatus = "ok" | "warning" | "over"

export type BudgetElementProps={
	budget: Budget
	category?: Category
	spentCents: number
}
export type BudgetBalanceProps={
	status: BudgetStatus
	remainingCents: number
}

export interface BudgetFormProps{
	defaultValues?: Partial<BudgetFormInput>
	submitLabel: string
	onSubmit: (values: BudgetFormValues) => Promise<void>
	onCancel: () => void
}
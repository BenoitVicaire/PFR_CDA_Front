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
	current: number
	max: number
}
import type { Budget, BudgetStatus } from "@/types/budget";
import type { Operation } from "@/types/operation";


export function getSpentCents(budget: Budget, operations: Operation[]): number{
	return operations
	.filter((op) => !op.deletedAt)
	.filter((op) => op.type==="expense")
	.filter((op) => op.categoryId===budget.categoryId)
	.filter((op) => op.date.startsWith(budget.month))
	.reduce((sum,op) => sum + op.amountCents, 0)
}

export function getStatus(current:number,max:number): BudgetStatus{
	const ratio = current / max
	if(ratio > 1) return "over"
	if(ratio >= 0.8) return "warning"
	return "ok"
}
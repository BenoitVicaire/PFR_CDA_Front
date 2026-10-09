import type { Budget } from "@/types"

export interface BudgetService {
  	list(userId: string, month?: string): Promise<Budget[]>
	get(userId: string, budgetId: string): Promise<Budget| null>
	create(userId: string, data: Omit<Budget, "id">): Promise<void>
	update(userId: string, budgetId: string, data: Partial<Omit<Budget, "id">>): Promise<void>
	delete(userId:string, budgetID:string): Promise<void>
}

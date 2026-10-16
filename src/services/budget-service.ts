import type { Budget } from "@/types"

export interface BudgetService {
  	/**
	 * Liste les budgets de l'utilisateur.
	 * @param month - Si fourni ("YYYY-MM"), ne renvoie que les budgets de ce mois ; sinon tous.
	 */
	list(userId: string, month?: string): Promise<Budget[]>
	get(userId: string, budgetId: string): Promise<Budget| null>
	create(userId: string, data: Omit<Budget, "id">): Promise<void>
	update(userId: string, budgetId: string, data: Partial<Omit<Budget, "id">>): Promise<void>
	delete(userId:string, budgetID:string): Promise<void>
}

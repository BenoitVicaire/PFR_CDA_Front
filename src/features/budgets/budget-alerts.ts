import { firebaseBudgetService } from "@/services/firebase/budget.service";
import { firebaseOperationService } from "@/services/firebase/operation.service";
import { groupBudgetsByAlert } from "./budget-utils";

export async function getOverBudget(userId:string, month:string){
	const [budgets, operations] = await Promise.all([
		firebaseBudgetService.list(userId,month),
		firebaseOperationService.list(userId),
	])
	return groupBudgetsByAlert(budgets, operations)
}
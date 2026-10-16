import { firebaseBudgetService } from "@/services/firebase/budget.service";
import { firebaseOperationService } from "@/services/firebase/operation.service";
import { groupBudgetsByAlert } from "./budget-utils";

/**
 * Charge les budgets d'un mois et les opérations de l'utilisateur (deux lectures en parallèle),
 * puis renvoie les budgets dépassés et à surveiller (US-016).
 * À utiliser par les écrans qui n'ont pas déjà ces données ; sinon appeler directement
 * groupBudgetsByAlert pour éviter des lectures inutiles.
 *
 * @param userId - Identifiant de l'utilisateur
 * @param month - Le mois ciblé, au format "YYYY-MM"
 * @returns `over` : budgets dépassés ; `warning` : budgets à surveiller
 */
export async function getOverBudget(userId:string, month:string){
	const [budgets, operations] = await Promise.all([
		firebaseBudgetService.list(userId,month),
		firebaseOperationService.list(userId),
	])
	return groupBudgetsByAlert(budgets, operations)
}
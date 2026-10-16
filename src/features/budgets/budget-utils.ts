import type { Budget, BudgetStatus } from "@/types/budget";
import type { Operation } from "@/types/operation";


/**
 * Calcule le montant dépensé pour un budget : somme des dépenses de sa catégorie, sur son mois.
 * Le total n'est pas stocké en base, il est dérivé des opérations (une seule source de vérité).
 * Exclut les revenus et les opérations soft-deletées (deletedAt).
 *
 * @param budget - Le budget concerné (catégorie et mois "YYYY-MM")
 * @param operations - Le jeu complet d'opérations de l'utilisateur (non filtré)
 * @returns Le total dépensé en centimes
 */
export function getSpentCents(budget: Budget, operations: Operation[]): number{
	return operations
	.filter((op) => !op.deletedAt)
	.filter((op) => op.type==="expense")
	.filter((op) => op.categoryId===budget.categoryId)
	.filter((op) => op.date.startsWith(budget.month))
	.reduce((sum,op) => sum + op.amountCents, 0)
}

/**
 * Détermine l'état d'un budget selon la règle de la jauge (US-016) :
 * moins de 80 % → "ok", de 80 % à 100 % inclus → "warning", au-delà de 100 % → "over".
 * Le plafond doit être strictement positif (garanti par la validation du formulaire).
 *
 * @param current - Montant dépensé, en centimes
 * @param max - Plafond du budget, en centimes
 * @returns L'état du budget
 */
export function getStatus(current:number,max:number): BudgetStatus{
	const ratio = current / max
	if(ratio > 1) return "over"
	if(ratio >= 0.8) return "warning"
	return "ok"
}

/**
 * Range les budgets en alerte dans deux groupes, d'après leur état (voir getStatus).
 * Les budgets "ok" sont ignorés. Fonction pure : aucune lecture de données.
 *
 * @param budgets - Les budgets à examiner (typiquement ceux d'un mois)
 * @param operations - Le jeu complet d'opérations de l'utilisateur
 * @returns `over` : budgets dépassés ; `warning` : budgets à surveiller
 */
export function groupBudgetsByAlert(budgets:Budget[],operations:Operation[]){
	const over : Budget[] = []
	const warning : Budget[] = []

	for (const b of budgets) {
		const status = getStatus(getSpentCents(b,operations), b.capCents)
		if (status === "over") over.push(b)
		else if (status === "warning") warning.push(b)
	}
	return { over, warning}
}
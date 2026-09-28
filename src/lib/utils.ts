import type { Operation, YearMonth } from "@/types/operation";

export { cn } from "cn"

/**
 * Calcule la somme des montants d'un type d'opération donné, pour un mois donné.
 * Exclut les opérations soft-deletées (deletedAt).
 *
 * @param operations - Le jeu complet d'opérations de l'utilisateur (non filtré)
 * @param type - Le type d'opération à sommer ("income" ou "expense")
 * @param month - Le mois ciblé, au format "YYYY-MM"
 * @returns Le total en centimes des opérations correspondantes
 */
export function totalTypeForMonth(operations:Operation[],type:Operation["type"],month:YearMonth):number{
	const monthOperations = operations.filter((operation)=> !operation.deletedAt && operation.date.startsWith(month))
	const total = monthOperations.reduce((sum, operation) => {
		if(operation.type !== type) return sum
		return sum + operation.amountCents
	}, 0 )
	return total
} 
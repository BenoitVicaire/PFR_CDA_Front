import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { LoadError } from "@/components/LoadError";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BudgetElement } from "../BudgetElement";
import { useAuth } from "@/hooks/useAuth";
import { toLocalMonth } from "@/lib/date";
import { firebaseOperationService } from "@/services/firebase/operation.service";
import type { Operation } from "@/types/operation";
import { getSpentCents, groupBudgetsByAlert } from "../budget-utils";
import { OverBudgetAlert } from "../OverBudgetAlert";
import type { Budget } from "@/types/budget";
import { firebaseBudgetService } from "@/services/firebase/budget.service";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function BudgetsListPage() {
	const { user } = useAuth()
	const [operations, setOperations] = useState<Operation[]>([])
	const [loading, setLoading] = useState(true)
	const [budgets, setBudgets] = useState<Budget[]>([])
	const currentMonth = toLocalMonth()
	const [error, setError] = useState<string | null>(null)

	const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
	const { categoryById, error: categoriesError } = useCategories();

	function updateMonthFilter(value: string) {
		setMonthFilter(value);
	}

	// function handleCarryOver() {
	// 	console.log("Work in progress");
	// }

	useEffect(() => {
		if (!user) return
		Promise.all([
			firebaseOperationService.list(user.id),
			firebaseBudgetService.list(user.id, monthFilter),
		])
		.then(([operation,budget]) => {
		  setOperations(operation)
		  setBudgets(budget)
		  setError(null)
		}).catch(()=> setError("Impossible de charger les budgets."))
		.finally(()=> setLoading(false))
	  }, [user,monthFilter])

	return (
		<section className="mx-auto w-full max-w-3xl px-4 py-12">
			{/* En tête */}
			<div>
				<h1 className="text-3xl font-bold text-primary text-center">
					Budget
				</h1>

				{/* Option de la table et boutons */}
				<div className="flex items-center gap-3 mt-6">
					<MonthPicker
						value={monthFilter}
						onChange={updateMonthFilter}
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<span tabIndex={0} className="ml-auto inline-block">
								<Button
									variant="outline"
									// onClick={handleCarryOver} 
									disabled
								>
									Reconduire le mois précédent
								</Button>
							</span>
						</TooltipTrigger>
						<TooltipContent>
							Bientôt disponible
						</TooltipContent>
					</Tooltip>

					<Button asChild>
						<Link to="/budgets/new">+ Ajouter un budget</Link>
					</Button>
				</div>
			</div>

			{loading ? (
				<p className="mt-6 text-muted-foreground">Chargement…</p>
			) : error || categoriesError ? (
				<div className="mt-6">
					<LoadError message={error ?? categoriesError!} />
				</div>
			) : (
				<>
					{/* US-016 : ne s'affiche que s'il y a un budget dépassé ou à surveiller. */}
					<div className="mt-4">
						<OverBudgetAlert {...groupBudgetsByAlert(budgets, operations)} operations={operations} />
					</div>
					{/* Composant BudgetElement : Rendu des card de chaque budget */}
					<section className="space-y-4 mt-4">
						{budgets.map((b) => (
							<BudgetElement
								key={b.id}
								budget={b}
								category={categoryById.get(b.categoryId)}
								spentCents={getSpentCents(b, operations)}
							/>
						))}
					</section>
				</>
			)}
		</section>
	);
}

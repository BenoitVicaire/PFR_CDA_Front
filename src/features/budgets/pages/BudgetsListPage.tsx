import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BudgetElement } from "../BudgetElement";
import { useAuth } from "@/hooks/useAuth";
import { firebaseOperationService } from "@/services/firebase/operation.service";
import type { Operation } from "@/types/operation";
import { getSpentCents } from "../budget-utils";

export function BudgetsListPage() {
	const { user } = useAuth()
	const { categories } = useCategories()
	const [operations, setOperations] = useState<Operation[]>([])
	const [loading, setLoading] = useState(true)
	const mock = categories.slice(0, 2).map((c, i) => ({ id: `b${i}`, categoryId: c.id, month: "2026-10", capCents: 10000 }))

	const [monthFilter, setMonthFilter] = useState<string>("");
	const { categoryById } = useCategories();

	function updateMonthFilter(value: string) {
		setMonthFilter(value);
	}

	function handleCarryOver() {
		console.log("test");
	}

	useEffect(() => {
		if (!user) return
		firebaseOperationService.list(user.id).then((result) => {
		  setOperations(result)
		  setLoading(false)
		})
	  }, [user])

	return (
		<section className="mx-auto w-full max-w-3xl px-4 py-12">
			{/* En tête */}
			<div >
				<h1 className="text-3xl font-bold text-primary text-center">
					Budget
				</h1>
				
				{/* Option de la table et boutons */}
				<div className="flex items-center gap-3 mt-6">
					<MonthPicker
						value={monthFilter}
						onChange={updateMonthFilter}
					/>

					<Button
						variant="outline"
						onClick={handleCarryOver}
						className="ml-auto"
					>
						Reconduire le mois précedent
					</Button>

					<Button asChild>
						<Link to="/budgets/new">+ Ajouter un budget</Link>
					</Button>
				</div>
			</div>

			{loading ? (
        		<p className="mt-6 text-muted-foreground">Chargement…</p>
      			) : (
			<Link
				to="/budgets"
				className="flex items-center gap-3 rounded-xl border border-warning bg-warning-100 px-3.5 py-3 mt-4"
			>
				<span className="flex shrink-0 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-white">
					!
				</span>
				<p className="flex-1 text-sm font-medium text-primary">
					2 catégories en dépassement
				</p>
				<span className="shrink-0 text-xs font-semibold text-warning">
					Voir →
				</span>
			</Link>
			)}
			{/* Composant BudgetElement : Rendu des card de chaque budget */}
			<section className="space-y-4 mt-4">
				{mock.map((b) => (
					<BudgetElement 
					key={b.id} 
					budget={b} 
					category={categoryById.get(b.categoryId)}
					spentCents={getSpentCents(b,operations)} 
					/>
				))}
			</section>
		</section>
	);
}

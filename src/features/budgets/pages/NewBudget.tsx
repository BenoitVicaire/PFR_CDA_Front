import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BudgetForm } from "../BudgetForm";
import { useAuth } from "@/hooks/useAuth";
import { firebaseBudgetService } from "@/services/firebase/budget.service";
import type { BudgetFormValues } from "../schemas";


export function NewBudget() {
	const { user } = useAuth()
	const navigate = useNavigate()

	async function handleSubmit(values: BudgetFormValues) {
		if (!user) return
		await firebaseBudgetService.create(user.id, {
		  categoryId: values.categoryId,
		  month: values.month,
		  capCents: Math.round(values.amount * 100),
		})
		navigate("/budgets")
	  }

	return (
		<div className="mx-auto max-w-sm px-4 py-8">
			<div className="rounded-2xl border border-border bg-card p-6">
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-xl font-semibold text-primary">
						Nouveau budget
					</h1>
					<Link
						to="/budgets"
						aria-label="Fermer"
						className="text-muted-foreground hover:text-primary"
					>
						<X className="size-5" />
					</Link>
				</div>
				<BudgetForm
					submitLabel="Valider"
					onSubmit={handleSubmit}
					onCancel={() => navigate("/budgets")}
				/>
			</div>
		</div>
	);
}

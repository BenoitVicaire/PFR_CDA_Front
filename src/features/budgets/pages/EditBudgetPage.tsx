import { X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BudgetForm } from "../BudgetForm";
import { useCategories } from "@/hooks/useCategories";
import { firebaseBudgetService } from "@/services/firebase/budget.service";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import type { Budget } from "@/types/budget";
import type { BudgetFormValues } from "../schemas";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function EditBudgetPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { id: budgetId } = useParams<{ id: string }>();
	const [budget, setBudget] = useState<Budget | null>(null);
	const [loading, setLoading] = useState(true);

	const { categoryById } = useCategories();
	const category = budget ? categoryById.get(budget.categoryId) : undefined;
	const categoryName = category?.name ?? "Catégorie inconnue";

	useEffect(() => {
		if (!user || !budgetId) return;
		firebaseBudgetService.get(user.id, budgetId).then((result) => {
			setBudget(result);
			setLoading(false);
		});
	}, [user, budgetId]);

	async function handleSubmit(values: BudgetFormValues) {
		if (!user || !budgetId) return;
		await firebaseBudgetService.update(user.id, budgetId, {
			capCents: Math.round(values.amount * 100),
		});
		navigate("/budgets");
	}

	async function handleDelete() {
		if (!user || !budgetId) return
		await firebaseBudgetService.delete(user.id, budgetId)
		navigate("/budgets")
	  }

	return (
		<div className="mx-auto max-w-sm px-4 py-8">
			<div className="rounded-2xl border border-border bg-card p-6">
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-xl font-semibold text-primary">
						Modification du budget de {categoryName}
					</h1>
					<Link
						to="/budgets"
						aria-label="Fermer"
						className="text-muted-foreground hover:text-primary"
					>
						<X className="size-5" />
					</Link>
				</div>
				{loading ? (
					<p className="text-muted-foreground">Chargement...</p>
				) : !budget ? (
					<p className="text-muted-foreground">Budget introuvable</p>
				) : (
					<>
						<BudgetForm
							submitLabel="Valider"
							editMode
							defaultValues={{
								categoryId: budget?.categoryId,
								month: budget.month,
								amount: budget.capCents / 100,
							}}
							onSubmit={handleSubmit}
							onCancel={() => navigate("/budgets")}
						/>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									size="sm"
									className="mt-3 w-full"
								>
									Supprimer cette opération
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Supprimer cette opération ?
									</AlertDialogTitle>
									<AlertDialogDescription>
										L’opération sera supprimée de votre
										liste et de vos calculs.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Annuler
									</AlertDialogCancel>
									<AlertDialogAction
										variant="destructive"
										onClick={handleDelete}
									>
										Supprimer
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
			</div>
		</div>
	);
}

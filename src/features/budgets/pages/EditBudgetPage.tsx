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
import { LoadError } from "@/components/LoadError";
import { Button } from "@/components/ui/button";

export function EditBudgetPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { id: budgetId } = useParams<{ id: string }>();
	const [budget, setBudget] = useState<Budget | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const { categoryById, loading: categoriesLoading } = useCategories();
	const category = budget ? categoryById.get(budget.categoryId) : undefined;
	const categoryName = category?.name ?? "Catégorie inconnue";
	// Évite d'afficher « Catégorie inconnue » pendant le chargement.
	const title = !budget || categoriesLoading ? "Modification du budget" : `Modification du budget de ${categoryName}`;

	useEffect(() => {
		if (!user || !budgetId) return;
		firebaseBudgetService
			.get(user.id, budgetId)
			.then(setBudget)
			.catch(() => setLoadError("Impossible de charger ce budget."))
			.finally(() => setLoading(false));
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
		setDeleteError(null)
		try {
			await firebaseBudgetService.delete(user.id, budgetId)
			navigate("/budgets")
		} catch {
			setDeleteError("La suppression a échoué, réessayez.")
		}
	}

	return (
		<div className="mx-auto max-w-sm px-4 py-8">
			<div className="rounded-2xl border border-border bg-card p-6">
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-xl font-semibold text-primary">
						{title}
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
					<p className="text-muted-foreground">Chargement…</p>
				) : loadError ? (
					<LoadError message={loadError} />
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

						{deleteError ? (
							<p role="alert" className="mt-3 text-sm text-destructive">{deleteError}</p>
						) : null}

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									size="sm"
									className="mt-3 w-full"
								>
									Supprimer ce budget
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Supprimer ce budget ?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Ce budget sera supprimé définitivement.
										Vos opérations sont conservées.
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

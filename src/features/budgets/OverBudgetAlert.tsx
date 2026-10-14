import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategories";
import type { OverBudgetAlertProps } from "@/types/budget";
import { getSpentCents } from "./budget-utils";

export function OverBudgetAlert({
		over, 
		warning,
		operations 
	}: OverBudgetAlertProps) {
	const overCount = over.length;
	const warningCount = warning.length;
	const { categoryById } = useCategories()
	const CURRENCY = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

	if (overCount === 0 && warningCount === 0) return null;
	
	return (
		<Dialog>
			<DialogTrigger asChild>
				{/* Partie visible qui ouvre la modale au clic */}
				<button
					type="button"
					className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-warning bg-warning-100 px-3.5 py-3 text-left hover:bg-warning-100/70"
				>
					<span className="flex shrink-0 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-white">
						!
					</span>
					<div className="flex flex-1 flex-col text-sm font-medium">
						{overCount > 0 && (
							<span className="text-destructive">
								{overCount}{" "}
								{overCount > 1 ? "catégories" : "catégorie"} en
								dépassement
							</span>
						)}
						{warningCount > 0 && (
							<span className="text-warning">
								{warningCount}{" "}
								{warningCount > 1 ? "catégories" : "catégorie"}{" "}
								à surveiller
							</span>
						)}
					</div>
					<span className="shrink-0 text-xs font-semibold text-warning">
						Voir →
					</span>
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{/* Titre de la modale */}</DialogTitle>
					<DialogDescription>
						{/* Description grisée de la modale */}
					</DialogDescription>
				</DialogHeader>
				{/* Corps de la modale */}
				{/* Table Over */}
				<h3 className="mt-4 text-lg font-semibold text-destructive text-center"> Dépassements</h3>
				<Table className="text-primary">
					<TableHeader>
						<TableRow>
							<TableHead className="text-right text-muted-foreground">Catégorie</TableHead>
							<TableHead className="text-right text-muted-foreground">
								Dépensé
							</TableHead>
							<TableHead className="text-right text-muted-foreground">
								Plafond
							</TableHead>
							<TableHead className="text-right text-muted-foreground">Consommé</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/* un <TableRow> par budget, via .map et key */}
						{over.map((o)=>(	
							<TableRow key={o.id}>
								{/* Categorie */}
								<TableCell className="text-right">{categoryById.get(o.categoryId)?.name}</TableCell>
								{/* Dépensé */}
								<TableCell className="text-right">{CURRENCY.format(getSpentCents(o, operations) / 100)}</TableCell>
								{/* Cap du budget */}
								<TableCell className="text-right">{CURRENCY.format(o.capCents / 100)}</TableCell>
								{/* % */}
								<TableCell className="text-right text-destructive font-semibold">{Math.round(getSpentCents(o, operations)/o.capCents *100)} %</TableCell>
							</TableRow>
						))}
						
					</TableBody>
				</Table>
				{/* Table Warning */}
				<h3 className="mt-4 text-lg font-semibold text-warning text-center"> A surveiller</h3>
				<Table className="text-primary">
					<TableHeader>
						<TableRow>
							<TableHead className="text-right text-muted-foreground">Catégorie</TableHead>
							<TableHead className="text-right text-muted-foreground">
								Dépensé
							</TableHead>
							<TableHead className="text-right text-muted-foreground">
								Plafond
							</TableHead>
							<TableHead className="text-right text-muted-foreground">Consommé</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/* un <TableRow> par budget, via .map et key */}
						{warning.map((w)=>(	
							<TableRow key={w.id}>
								{/* Categorie */}
								<TableCell className="text-right">{categoryById.get(w.categoryId)?.name}</TableCell>
								{/* Dépensé */}
								<TableCell className="text-right">{CURRENCY.format(getSpentCents(w, operations) / 100)}</TableCell>
								{/* Cap du budget */}
								<TableCell className="text-right">{CURRENCY.format(w.capCents / 100)}</TableCell>
								{/* % */}
								<TableCell className="text-right text-warning font-semibold">{Math.round(getSpentCents(w, operations)/w.capCents *100)} %</TableCell>
							</TableRow>
						))}
						
					</TableBody>
				</Table>
			</DialogContent>
		</Dialog>
	);
}

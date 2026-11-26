import { CircleAlert, TriangleAlert, type LucideIcon } from "lucide-react";

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
import { formatCents } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Budget, OverBudgetAlertProps } from "@/types/budget";
import type { Category } from "@/types/category";
import type { Operation } from "@/types/operation";
import { getSpentCents } from "./budget-utils";

interface BudgetAlertTableProps {
	title: string;
	icon: LucideIcon;
	titleClassName: string;
	budgets: Budget[];
	operations: Operation[];
	categoryById: Map<string, Category>;
}

// ENF-U04 : chaque groupe est identifié par une icône et un titre, pas seulement par sa couleur.
function BudgetAlertTable({ title, icon: Icon, titleClassName, budgets, operations, categoryById }: BudgetAlertTableProps) {
	if (budgets.length === 0) return null;

	return (
		<section>
			<h3 className={cn("flex items-center justify-center gap-2 text-lg font-semibold", titleClassName)}>
				<Icon className="size-5" aria-hidden="true" />
				{title}
			</h3>
			<Table className="text-primary">
				<TableHeader className="[&_th]:text-muted-foreground">
					<TableRow>
						<TableHead>Catégorie</TableHead>
						<TableHead className="text-right">Dépensé</TableHead>
						<TableHead className="text-right">Plafond</TableHead>
						<TableHead className="text-right">Consommé</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{budgets.map((budget) => {
						const spentCents = getSpentCents(budget, operations);
						return (
							<TableRow key={budget.id}>
								<TableCell>{categoryById.get(budget.categoryId)?.name}</TableCell>
								<TableCell className="text-right">{formatCents(spentCents)}</TableCell>
								<TableCell className="text-right">{formatCents(budget.capCents)}</TableCell>
								<TableCell className={cn("text-right font-semibold", titleClassName)}>
									{Math.round((spentCents / budget.capCents) * 100)} %
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</section>
	);
}

/** Bandeau des budgets dépassés ou à surveiller, avec le détail dans une fenêtre (US-016, EF-E01). */
export function OverBudgetAlert({ over, warning, operations }: OverBudgetAlertProps) {
	const overCount = over.length;
	const warningCount = warning.length;
	const { categoryById } = useCategories();

	if (overCount === 0 && warningCount === 0) return null;

	const BannerIcon = overCount > 0 ? CircleAlert : TriangleAlert;

	return (
		<Dialog>
			<DialogTrigger asChild>
				{/* Partie visible qui ouvre la modale au clic */}
				<button
					type="button"
					className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-warning bg-warning-100 px-3.5 py-3 text-left hover:bg-warning-100/70"
				>
					<BannerIcon
						className={cn("size-5 shrink-0", overCount > 0 ? "text-destructive" : "text-warning-700")}
						aria-hidden="true"
					/>
					<div className="flex flex-1 flex-col text-sm font-medium">
						{overCount > 0 && (
							<span className="text-destructive">
								{overCount} {overCount > 1 ? "catégories" : "catégorie"} en dépassement
							</span>
						)}
						{warningCount > 0 && (
							<span className="text-warning-700">
								{warningCount} {warningCount > 1 ? "catégories" : "catégorie"} à surveiller
							</span>
						)}
					</div>
					<span className="shrink-0 text-xs font-semibold text-warning-700">Voir →</span>
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Alertes de budget</DialogTitle>
					<DialogDescription>Budgets dépassés ou proches de leur plafond.</DialogDescription>
				</DialogHeader>
				<BudgetAlertTable
					title="Dépassements"
					icon={CircleAlert}
					titleClassName="text-destructive"
					budgets={over}
					operations={operations}
					categoryById={categoryById}
				/>
				<BudgetAlertTable
					title="À surveiller"
					icon={TriangleAlert}
					titleClassName="text-warning-700"
					budgets={warning}
					operations={operations}
					categoryById={categoryById}
				/>
			</DialogContent>
		</Dialog>
	);
}

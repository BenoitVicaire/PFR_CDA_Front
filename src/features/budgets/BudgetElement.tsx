import type {  BudgetBalanceProps, BudgetElementProps} from "@/types/budget";
import { CATEGORY_ICONS } from "../categories/category-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStatus } from "./budget-utils";
import { formatCents } from "@/lib/format";
import { Check, CircleAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

function BudgetBalance({current,max}: BudgetBalanceProps){
	const status = getStatus(current,max)
	const remaining = max - current

	const MESSAGES = {
		ok: `${formatCents(remaining)} restants`,
		warning: "Budget presque atteint",
		over: `Dépassement : +${formatCents(-remaining)}`,
	}
	const STATUS_UI = {
		ok : {icon: Check, text: "text-success", bar:"bg-success"},
		warning : {icon: TriangleAlert, text: "text-foreground", bar:"bg-warning"},
		over : {icon: CircleAlert, text: "text-destructive", bar:"bg-destructive"},
	}
	const {icon : Icon, text} = STATUS_UI[status]

	return (
		<p className={cn("flex items-center gap-1.5 text-sm",text)}>
			<Icon className="size-4" />
			{MESSAGES[status]}
		</p>
	)
}

export function BudgetElement({ budget, category, spentCents }:  BudgetElementProps) {
	const Icon = category ? CATEGORY_ICONS[category.icon] : undefined
	return (
		<Card>
			{/* Icon titre et % */}
			<CardHeader>
				<CardTitle className="flex items-center gap-3 text-primary">
					<span
						className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
						style={{ backgroundColor: `var(--${category?.color})` }}
					>
						{Icon ? <Icon className="size-4"/> : null}
					</span>
					{category?.name ?? "Catégorie Inconnue"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Progress bar */}
				<Progress value={33} />
				{/* Actuel / max */}
				<div className="flex gap-1">
					<span className="text-primary">{spentCents/100} €</span>
					<span className="text-muted-foreground">/ {budget.capCents/100} €</span>
				</div>
				{/* Balance / alerte */}
					<BudgetBalance
						current={spentCents}
						max={budget.capCents} />
				{/* Bouton Modifier */}

			</CardContent>

		</Card>
	);
}
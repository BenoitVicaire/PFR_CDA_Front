import type {  BudgetBalanceProps, BudgetElementProps} from "@/types/budget";
import { CATEGORY_ICONS } from "../categories/category-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStatus } from "./budget-utils";
import { formatCents } from "@/lib/format";
import { Check, CircleAlert, SquarePen, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const STATUS_UI = {
		ok : {icon: Check, text: "text-success", background: "bg-success-100", bar:"bg-success"},
		warning : {icon: TriangleAlert, text: "text-foreground", background:"bg-warning", bar:"bg-warning"},
		over : {icon: CircleAlert, text: "text-destructive",background: "bg-destructive/10", bar:"bg-destructive"},
	}


function BudgetBalance({status, remainingCents}: BudgetBalanceProps){
	const MESSAGES = {
		ok: `${formatCents(remainingCents)} restants`,
		warning: "Budget presque atteint",
		over: `Dépassement : +${formatCents(remainingCents)}`,
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
	const CategoryIcon = category ? CATEGORY_ICONS[category.icon] : undefined
	const status = getStatus(spentCents,budget.capCents)
	const {icon : StatusIcon, text, background} = STATUS_UI[status]
	const percent = Math.round((spentCents/budget.capCents)*100)


	return (
		<Card>
			{/* Icon titre et % */}
			<CardHeader>
				<CardTitle className="flex items-center gap-3 text-primary">
					{/* Icon */}
					<span
						className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
						style={{ backgroundColor: `var(--${category?.color})` }}
					>
						{CategoryIcon ? <CategoryIcon className="size-4"/> : null}
					</span>
					{/* Titre */}
					{category?.name ?? "Catégorie Inconnue"}
					{/* % */}
					<div className={cn("ml-auto flex items-center gap-1 text-sm font-semibold rounded-full px-2.5 py-1",text, background )}>
						<StatusIcon className="size-4" />
						{percent} %
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Progress bar */}
				<Progress 
				value={spentCents / budget.capCents * 100} 
				indicatorClassName={STATUS_UI[status].bar}/>
				{/* Actuel / max */}
				<div className="flex gap-1">
					<span className="text-primary">{spentCents/100} €</span>
					<span className="text-muted-foreground">/ {budget.capCents/100} €</span>
				</div>
				<div className=" flex items-center justify-between gap-3">
					{/* Balance / alerte */}
						<BudgetBalance
							status={status}
							remainingCents={budget.capCents - spentCents}
							/>
					{/* Bouton Modifier */}
						<Button asChild variant={"outline"} size="sm" className="bg-card text-primary">
							<Link to={`/budgets/${budget.id}/edit`}>
							<SquarePen /> Modifier
							</Link>
						</Button>
				</div>
			</CardContent>

		</Card>
	);
}
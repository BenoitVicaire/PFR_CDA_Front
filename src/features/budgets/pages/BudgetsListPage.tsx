import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import type { Budget } from "@/types/budget";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockBudgets:Budget[]=[
	{id:"b1",
	categoryId: "alimentation",
	month:"2026-10",
	capCents:10000
	},
	{id:"b2",
	categoryId: "loisir",
	month:"2026-10",
	capCents:20000
	}
]


// const categoryById = new Map(categories.map(c=>[c.id, c]))
	

function BudgetElement({budget}:{budget: Budget}){
	const {categoryById} = useCategories()
	return(
	<Card>
		<CardHeader>
			<CardTitle>{categoryById.get(budget.categoryId)?.name}</CardTitle>
			<CardDescription>Card Description</CardDescription>
			<CardAction>Card Action</CardAction>
		</CardHeader>
		<CardContent>
			<p>Card Content</p>
		</CardContent>
		<CardFooter>
			<p>Card Footer</p>
		</CardFooter>
	</Card>
	)
}

export function BudgetsListPage() {
	const [monthFilter, setMonthFilter] = useState<string>("")

	function updateMonthFilter(value: string) {
		setMonthFilter(value)
	}

	function handleCarryOver(){
		console.log("test");
		
	}

  return (
	<><div className="mx-auto max-w-3xl px-4 py-12">
		<h1 className="text-3xl font-bold text-primary text-center">Budget</h1>

		<div className="flex items-center gap-3">
			<MonthPicker value={monthFilter} onChange={updateMonthFilter} />

			<Button variant="outline" onClick={handleCarryOver} className="ml-auto">
				Reconduire le mois précedent
			</Button>

			<Button asChild >
				<Link to="/budgets/new">+ Ajouter un budget</Link>
			</Button>
			
		</div>
	</div>
	<Link
        to="/budgets"
        className="flex items-center gap-3 rounded-xl border border-warning bg-warning-100 px-3.5 py-3"
		>
        <span className="flex shrink-0 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-white">
          !
        </span>
        <p className="flex-1 text-sm font-medium text-primary">2 catégories en dépassement</p>
        <span className="shrink-0 text-xs font-semibold text-warning">Voir →</span>
      </Link>
	<section className="space-y-4">
		{mockBudgets.map((b)=>(
			<BudgetElement key={b.id} budget={b} />
		))}
	</section>
  </>
  )
}



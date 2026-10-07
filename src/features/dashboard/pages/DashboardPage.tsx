import { ChevronDown, Menu } from "lucide-react"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis } from "recharts"
import { Link } from "react-router-dom"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import type { Operation } from "@/types/operation"
import { useAuth } from "@/hooks/useAuth"
import { firebaseOperationService } from "@/services/firebase/operation.service"
import { totalTypeForMonth } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const CURRENCY = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })


// Données de démonstration en attendant le service de statistiques/budgets (à brancher plus tard).
const BUDGET_PROGRESS = [
  { name: "Logement", percent: 100 },
  { name: "Alimentation", percent: 60 },
  { name: "Loisirs", percent: 110 },
]

const EXPENSE_BREAKDOWN = [
  { name: "Logement", value: 42, fill: "var(--category-9)" },
  { name: "Alimentation", value: 12, fill: "var(--category-2)" },
  { name: "Loisirs", value: 25, fill: "var(--category-3)" },
  { name: "Factures", value: 21, fill: "var(--category-1)" },
]

const MONTHLY_EXPENSES = [
  { month: "Jan", amount: 1800 },
  { month: "Fév", amount: 2100 },
  { month: "Mar", amount: 1900 },
  { month: "Avr", amount: 2400 },
  { month: "Mai", amount: 2000 },
  { month: "Jun", amount: 2200 },
  { month: "Jul", amount: 2100 },
]

const RECENT_OPERATIONS = [
  { date: "15/07", label: "Courses Alimentation", amountCents: -4250 },
  { date: "14/07", label: "Salaire", amountCents: 240000 },
  { date: "13/07", label: "Loyer", amountCents: -90000 },
  { date: "12/07", label: "Netflix", amountCents: -1349 },
  { date: "11/07", label: "Cinéma", amountCents: -2000 },
]

const CHART_CONFIG = {
  amount: { label: "Dépenses" },
} satisfies ChartConfig

function budgetStatusClasses(percent: number) {
  if (percent > 100) return { text: "text-destructive", bar: "bg-destructive" }
  if (percent >= 80) return { text: "text-warning", bar: "bg-warning" }
  return { text: "text-success", bar: "bg-success" }
}

// Gère le comportement du bloc d'en tête balance / depense /revenu
function BalanceBlock({currentBalance,previousBalance,currentMonth,previousMonth}:{currentBalance:number,previousBalance:number,currentMonth:Date,previousMonth:Date}){
	const monthYearString= currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
	const previousMonthLabel = previousMonth.toLocaleDateString("fr-FR", { month: "long" })
	
	return (
		<>
		<p className="text-xl text-primary font-medium tracking-widest text-center uppercase">{monthYearString}</p>
        <div className="mt-3 flex items-center gap-2">
			{currentBalance>0
				?(<p className="text-3xl font-bold text-success">{CURRENCY.format(currentBalance / 100)}</p>)
				:(<p className="text-3xl font-bold text-destructive">{CURRENCY.format(currentBalance / 100)}</p>)
			}
			{currentBalance>previousBalance
			?(<p className="text-xs font-medium text-success">↑ vs {previousMonthLabel}</p>)
			:(<p className="text-xs font-medium text-destructive">↓ vs {previousMonthLabel}</p>)
			}
          
		  
        </div>
		</>
		
	)
}

export function DashboardPage() {

	const { user } = useAuth()
	const [loading, setLoading] = useState(true)

	const [operations,setOperations] = useState<Operation[]>([])

	const currentDate = new Date()
	const currentMonth = `${currentDate.getFullYear()}-${(String(currentDate.getMonth()+1)).padStart(2, "0")}`

	const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
	const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`
	

	const totalIncomeForCurrentMonth=totalTypeForMonth(operations,"income",currentMonth)
	const totalExpenseForCurrentMonth=totalTypeForMonth(operations,"expense",currentMonth)
	const currentMonthBalance = totalIncomeForCurrentMonth - totalExpenseForCurrentMonth
	
	const totalIncomeForLastMonth=totalTypeForMonth(operations,"income",lastMonth)
	const totalExpenseForLastMonth=totalTypeForMonth(operations,"expense",lastMonth)
	const lastMonthBalance = totalIncomeForLastMonth - totalExpenseForLastMonth

	useEffect(()=>{
		if(!user)return
		firebaseOperationService.list(user.id).then(
			(operationsResult) => {
			setOperations(operationsResult)
			setLoading(false)
			})
	},[user])

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-3">
      <div className="flex items-center justify-between py-2 md:hidden">
        <Menu className="size-6 text-primary" />
        <p className="text-lg font-medium text-primary">Budget Perso</p>
        <div className="size-7 rounded-full bg-muted" />
      </div>
	  {loading?(
		<Spinner className="size-6 text-primary" />
	  ):(
      <section className="rounded-xl border border-border bg-card p-4">
		{/* Balance */}
		<BalanceBlock
		currentBalance={currentMonthBalance}
		previousBalance={lastMonthBalance}
		currentMonth={currentDate}
		previousMonth={lastMonthDate}
		/>
        
		{/* Revenus */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Revenus</p>
          <p className="font-semibold text-success">{CURRENCY.format(totalIncomeForCurrentMonth / 100)}</p>
        </div>
		{/* Depenses */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Dépenses</p>
          <p className="font-semibold text-destructive">- {CURRENCY.format(totalExpenseForCurrentMonth / 100)}</p>
        </div>
      </section>
	  )}

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

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-primary">Progression des budgets</h2>
          <ChevronDown className="size-5 text-muted-foreground" />
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {BUDGET_PROGRESS.map((budget) => {
            const status = budgetStatusClasses(budget.percent)
            return (
              <div key={budget.name}>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-primary">{budget.name}</p>
                  <p className={`font-semibold ${status.text}`}>{budget.percent} %</p>
                </div>
                <Progress
                  value={Math.min(budget.percent, 100)}
                  className="mt-1 h-2"
                  indicatorClassName={status.bar}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-primary">Répartition des dépenses</h2>
        <ChartContainer config={CHART_CONFIG} className="mx-auto mt-2 aspect-square max-h-40">
          <PieChart>
            <Pie data={EXPENSE_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70}>
              {EXPENSE_BREAKDOWN.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 flex flex-col gap-2">
          {EXPENSE_BREAKDOWN.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
              <p className="flex-1 text-primary">{entry.name}</p>
              <p className="font-semibold text-primary">{entry.value} %</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-primary">Dépenses par mois</h2>
        <ChartContainer config={CHART_CONFIG} className="mt-2 aspect-auto h-32 w-full">
          <BarChart data={MONTHLY_EXPENSES}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
            <Bar dataKey="amount" radius={4}>
              {MONTHLY_EXPENSES.map((entry) => (
                <Cell key={entry.month} fill={entry.month === "Jul" ? "var(--primary)" : "var(--primary-100)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-primary">Dernières opérations</h2>
        <div className="mt-3 flex flex-col gap-1">
          {RECENT_OPERATIONS.map((operation) => (
            <div key={operation.label} className="flex items-center gap-2 py-1.5 text-sm">
              <p className="w-10 shrink-0 text-xs font-medium text-muted-foreground">{operation.date}</p>
              <p className="flex-1 text-primary">{operation.label}</p>
              <p className={`font-semibold ${operation.amountCents >= 0 ? "text-success" : "text-destructive"}`}>
                {operation.amountCents >= 0 ? "+" : "-"}
                {CURRENCY.format(Math.abs(operation.amountCents) / 100)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}



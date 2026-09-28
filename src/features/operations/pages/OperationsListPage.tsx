import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { MonthPicker } from "@/components/MonthPicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { firebaseCategoryService } from "@/services/firebase/category.service"
import { firebaseOperationService } from "@/services/firebase/operation.service"
import type { Category, Operation } from "@/types"

const PAGE_SIZE = 25

const CURRENCY = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"

export function OperationsListPage() {
  const { user } = useAuth()
  const [operations, setOperations] = useState<Operation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [monthFilter, setMonthFilter] = useState<string>("")
  const [sort, setSort] = useState<SortOption>("date-desc")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user) return
    Promise.all([firebaseOperationService.list(user.id), firebaseCategoryService.list(user.id)]).then(
      ([operationsResult, categoriesResult]) => {
        setOperations(operationsResult)
        setCategories(categoriesResult)
        setLoading(false)
      },
    )
  }, [user])

  function updateTypeFilter(value: "all" | "income" | "expense") {
    setTypeFilter(value)
    setPage(1)
  }

  function updateCategoryFilter(value: string) {
    setCategoryFilter(value)
    setPage(1)
  }

  function updateMonthFilter(value: string) {
    setMonthFilter(value)
    setPage(1)
  }

  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories])

  const filtered = useMemo(() => {
    return operations
      .filter((operation) => !operation.deletedAt)
      .filter((operation) => typeFilter === "all" || operation.type === typeFilter)
      .filter((operation) => categoryFilter === "all" || operation.categoryId === categoryFilter)
      .filter((operation) => !monthFilter || operation.date.startsWith(monthFilter))
  }, [operations, typeFilter, categoryFilter, monthFilter])

  const sorted = useMemo(() => {
    const items = [...filtered]
    items.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return a.date.localeCompare(b.date)
        case "amount-desc":
          return b.amountCents - a.amountCents
        case "amount-asc":
          return a.amountCents - b.amountCents
        default:
          return b.date.localeCompare(a.date)
      }
    })
    return items
  }, [filtered, sort])

  const total = useMemo(
    () => filtered.reduce((sum, op) => sum + (op.type === "income" ? op.amountCents : -op.amountCents), 0),
    [filtered],
  )

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary text-center">Opérations</h1>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <Select value={typeFilter} onValueChange={(value) => updateTypeFilter(value as typeof typeFilter)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="income">Revenus</SelectItem>
            <SelectItem value="expense">Dépenses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={updateCategoryFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <MonthPicker value={monthFilter} onChange={updateMonthFilter} />

        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (récent → ancien)</SelectItem>
            <SelectItem value="date-asc">Date (ancien → récent)</SelectItem>
            <SelectItem value="amount-desc">Montant (décroissant)</SelectItem>
            <SelectItem value="amount-asc">Montant (croissant)</SelectItem>
          </SelectContent>
        </Select>

        <Button asChild className="ml-auto">
          <Link to="/operations/nouveau">Ajouter</Link>
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-muted-foreground">Chargement…</p>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell>
                      <Link to={`/operations/${operation.id}`} className="block font-medium text-primary">
                        {operation.date}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {categoryById.get(operation.categoryId)?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{operation.label || "—"}</TableCell>
                    <TableCell
                      className={`text-right font-semibold ${operation.type === "income" ? "text-success" : "text-destructive"}`}
                    >
                      {operation.type === "income" ? "+" : "-"}
                      {CURRENCY.format(operation.amountCents / 100)}
                    </TableCell>
                  </TableRow>
                ))}
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucune opération.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <p className="font-medium text-primary">
                Total :{" "}
                <span className={total >= 0 ? "text-success" : "text-destructive"}>
                  {CURRENCY.format(total / 100)}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} / {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

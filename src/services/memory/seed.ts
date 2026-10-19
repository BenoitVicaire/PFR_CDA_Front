import { DEFAULT_CATEGORIES } from "../../features/categories/default-categories"
import type { Budget, Category, Operation } from "../../types"

export interface UserData {
  categories: Category[]
  operations: Operation[]
  budgets: Budget[]
}

/** Compte de démonstration utilisé par les tests de bout en bout. */
export const DEMO_USER = {
  id: "user-demo",
  email: "marc@example.com",
  password: "MonMdp1!",
  displayName: "Marc",
} as const

const pad = (value: number) => String(value).padStart(2, "0")

/** Construit les 12 catégories par défaut avec des identifiants stables (`cat-1` à `cat-12`). */
export function createDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((category, index) => ({
    ...category,
    id: `cat-${index + 1}`,
    isDefault: true,
  }))
}

function categoryId(categories: Category[], name: string): string {
  const category = categories.find((item) => item.name === name)
  if (!category) throw new Error(`Catégorie de démonstration introuvable : ${name}`)
  return category.id
}

/**
 * Jeu de données du compte de démonstration.
 *
 * - Mars de l'année précédente : 12 dépenses Alimentation, 15 dépenses Transport et 1 salaire
 *   (28 opérations, de quoi tester les filtres et la pagination).
 * - Mois courant : 1 salaire de 2 000 € et 1 loyer de 800 €.
 * - Mois courant : un budget Alimentation de 100 €, sans dépense, pour tester l'alerte de dépassement.
 */
export function createDemoData(now: Date = new Date()): UserData {
  const categories = createDefaultCategories()
  const food = categoryId(categories, "Alimentation")
  const transport = categoryId(categories, "Transport")
  const salary = categoryId(categories, "Salaire")
  const housing = categoryId(categories, "Logement")

  const previousYear = now.getFullYear() - 1
  const currentMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
  const operations: Operation[] = []

  for (let day = 1; day <= 12; day++) {
    operations.push({
      id: `op-seed-food-${day}`,
      type: "expense",
      amountCents: 1000 + day * 100,
      date: `${previousYear}-03-${pad(day)}`,
      label: `Courses ${day}`,
      categoryId: food,
      deletedAt: null,
    })
  }

  for (let day = 13; day <= 27; day++) {
    operations.push({
      id: `op-seed-transport-${day}`,
      type: "expense",
      amountCents: 500,
      date: `${previousYear}-03-${pad(day)}`,
      label: `Transport ${day - 12}`,
      categoryId: transport,
      deletedAt: null,
    })
  }

  operations.push(
    {
      id: "op-seed-salary-march",
      type: "income",
      amountCents: 180000,
      date: `${previousYear}-03-28`,
      label: "Salaire mars",
      categoryId: salary,
      deletedAt: null,
    },
    {
      id: "op-seed-salary-current",
      type: "income",
      amountCents: 200000,
      date: `${currentMonth}-01`,
      label: "Salaire du mois",
      categoryId: salary,
      deletedAt: null,
    },
    {
      id: "op-seed-rent-current",
      type: "expense",
      amountCents: 80000,
      date: `${currentMonth}-02`,
      label: "Loyer",
      categoryId: housing,
      deletedAt: null,
    },
  )

  const budgets: Budget[] = [
    { id: "budget-seed-food", categoryId: food, month: currentMonth, capCents: 10000 },
  ]

  return { categories, operations, budgets }
}

/** Données d'un utilisateur fraîchement inscrit : tout est vide, les catégories sont créées à l'inscription. */
export function createEmptyData(): UserData {
  return { categories: [], operations: [], budgets: [] }
}

import type { BudgetService } from "@/services/budget-service"

import { getUserData, nextId } from "./store"

/** Implémentation en mémoire de {@link BudgetService} pour les tests de bout en bout. */
export const firebaseBudgetService: BudgetService = {
  async list(userId, month) {
    const budgets = getUserData(userId).budgets
    return structuredClone(month ? budgets.filter((budget) => budget.month === month) : budgets)
  },

  async get(userId, budgetId) {
    const budget = getUserData(userId).budgets.find((item) => item.id === budgetId)
    return budget ? structuredClone(budget) : null
  },

  async create(userId, data) {
    getUserData(userId).budgets.push({ ...data, id: nextId("budget") })
  },

  async update(userId, budgetId, data) {
    const budget = getUserData(userId).budgets.find((item) => item.id === budgetId)
    if (!budget) throw new Error("Budget introuvable")
    Object.assign(budget, data)
  },

  async delete(userId, budgetId) {
    const data = getUserData(userId)
    data.budgets = data.budgets.filter((item) => item.id !== budgetId)
  },
}

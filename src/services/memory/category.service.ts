import type { CategoryService } from "@/services/category-service"

import { getUserData, nextId } from "./store"

/** Implémentation en mémoire de {@link CategoryService} pour les tests de bout en bout. */
export const firebaseCategoryService: CategoryService = {
  async list(userId) {
    return structuredClone(getUserData(userId).categories)
  },

  async create(userId, data) {
    getUserData(userId).categories.push({ ...data, id: nextId("cat") })
  },

  async update(userId, categoryId, data) {
    const category = getUserData(userId).categories.find((item) => item.id === categoryId)
    if (!category) throw new Error("Catégorie introuvable")
    Object.assign(category, data)
  },

  async delete(userId, categoryId) {
    const data = getUserData(userId)
    data.categories = data.categories.filter((item) => item.id !== categoryId)
  },
}

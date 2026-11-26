import { DEFAULT_CATEGORIES } from "@/features/categories/default-categories"
import type { CategoryService } from "@/services/category-service"

// EF-C02 : 12 catégories par défaut créées automatiquement à l'inscription.
export async function seedDefaultCategories(categoryService: CategoryService, userId: string) {
  await categoryService.createMany(
    userId,
    DEFAULT_CATEGORIES.map((category) => ({ ...category, isDefault: true }))
  )
}

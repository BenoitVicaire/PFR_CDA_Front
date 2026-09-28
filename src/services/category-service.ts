import type { Category } from "@/types"

export interface CategoryService {
  list(userId: string): Promise<Category[]>
  create(userId: string, data: Omit<Category, "id">): Promise<void>
  update(userId: string, categoryId: string, data: Partial<Omit<Category, "id">>): Promise<void>
  delete(userId: string, categoryId: string): Promise<void>
}
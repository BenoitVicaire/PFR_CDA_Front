import { LoadError } from "@/components/LoadError"
import { CATEGORY_ICONS } from "@/features/categories/category-icons"
import { useCategories } from "@/hooks/useCategories"

export function CategoriesListPage() {
  const { categories, loading, error } = useCategories()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">Catégories</h1>

      {loading ? (
        <p className="mt-4 text-muted-foreground">Chargement…</p>
      ) : error ? (
        <div className="mt-6">
          <LoadError message={error} />
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon]
            return (
              <li
                key={category.id}
                className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: `var(--${category.color})` }}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                </span>
                <span>{category.name}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

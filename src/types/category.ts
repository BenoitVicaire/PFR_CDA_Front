export interface Category {
  id: string
  name: string
  icon: string
  color: string
  isDefault: boolean
  type: "income" | "expense"
}

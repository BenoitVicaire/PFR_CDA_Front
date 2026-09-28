export type OperationType = "income" | "expense"

export interface Operation {
  id: string
  type: OperationType
  amountCents: number
  date: string
  label: string | null
  categoryId: string
  deletedAt: string | null
}

export type YearMonth = string

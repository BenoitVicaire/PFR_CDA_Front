import type { Operation } from "@/types"

export interface OperationService {
  list(userId: string): Promise<Operation[]>
  get(userId: string, operationId: string): Promise<Operation | null>
  create(userId: string, data: Omit<Operation, "id" | "deletedAt">): Promise<void>
  update(userId: string, operationId: string, data: Partial<Omit<Operation, "id">>): Promise<void>
  softDelete(userId: string, operationId: string): Promise<void>
}

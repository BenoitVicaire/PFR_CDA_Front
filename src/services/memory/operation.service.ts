import type { OperationService } from "@/services/operation-service"

import { getUserData, nextId } from "./store"

/**
 * Implémentation en mémoire de {@link OperationService}, utilisée par les tests de bout en bout.
 * Exportée sous le nom `firebaseOperationService` : l'alias Vite du mode `e2e` substitue ce module
 * à `services/firebase/operation.service`, les composants restent inchangés.
 */
export const firebaseOperationService: OperationService = {
  async list(userId) {
    return structuredClone(getUserData(userId).operations)
  },

  async get(userId, operationId) {
    const operation = getUserData(userId).operations.find((item) => item.id === operationId)
    return operation ? structuredClone(operation) : null
  },

  async create(userId, data) {
    getUserData(userId).operations.push({ ...data, id: nextId("op"), deletedAt: null })
  },

  async update(userId, operationId, data) {
    const operation = getUserData(userId).operations.find((item) => item.id === operationId)
    if (!operation) throw new Error("Opération introuvable")
    Object.assign(operation, data)
  },

  async softDelete(userId, operationId) {
    const operation = getUserData(userId).operations.find((item) => item.id === operationId)
    if (!operation) throw new Error("Opération introuvable")
    operation.deletedAt = new Date().toISOString()
  },
}

import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { OperationService } from "@/services/operation-service"
import type { Operation } from "@/types"

function operationsRef(userId: string) {
  return collection(db, "users", userId, "operations")
}

export const firebaseOperationService: OperationService = {
  async list(userId) {
    const snapshot = await getDocs(operationsRef(userId))
    return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as Operation)
  },

  async get(userId, operationId) {
    const snapshot = await getDoc(doc(db, "users", userId, "operations", operationId))
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Operation) : null
  },

  async create(userId, data) {
    await addDoc(operationsRef(userId), { ...data, deletedAt: null })
  },

  async update(userId, operationId, data) {
    await updateDoc(doc(db, "users", userId, "operations", operationId), data)
  },

  // EF-B02 : soft delete, purge après 30 j gérée côté backend/tâche planifiée (hors périmètre front).
  async softDelete(userId, operationId) {
    await updateDoc(doc(db, "users", userId, "operations", operationId), {
      deletedAt: new Date().toISOString(),
    })
  },
}

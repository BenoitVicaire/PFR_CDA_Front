import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { CategoryService } from "@/services/category-service"
import type { Category } from "@/types"

function categoriesRef(userId: string) {
  return collection(db, "users", userId, "categories")
}

export const firebaseCategoryService: CategoryService = {
  async list(userId) {
    const snapshot = await getDocs(categoriesRef(userId))
    return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as Category)
  },

  async create(userId, data) {
    await addDoc(categoriesRef(userId), data)
  },

  async update(userId, categoryId, data) {
    await updateDoc(doc(db, "users", userId, "categories", categoryId), data)
  },

  async delete(userId, categoryId) {
    await deleteDoc(doc(db, "users", userId, "categories", categoryId))
  },
}

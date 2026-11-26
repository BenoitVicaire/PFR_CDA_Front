import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, writeBatch } from "firebase/firestore"

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

  async createMany(userId, data) {
    const batch = writeBatch(db)
    data.forEach((category) => batch.set(doc(categoriesRef(userId)), category))
    await batch.commit()
  },

  async update(userId, categoryId, data) {
    await updateDoc(doc(db, "users", userId, "categories", categoryId), data)
  },

  async delete(userId, categoryId) {
    const reference = doc(db, "users", userId, "categories", categoryId)
    const snapshot = await getDoc(reference)
    if (snapshot.data()?.isDefault) throw new Error("Une catégorie par défaut ne peut pas être supprimée")
    await deleteDoc(reference)
  },
}

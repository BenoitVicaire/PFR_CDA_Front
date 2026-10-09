import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { BudgetService } from "../budget-service"
import type { Budget } from "@/types/budget"

function budgetsRef(userId: string){
	return collection(db, "users", userId, "budgets")
}

export const firebaseBudgetService: BudgetService = {
	async list(userId){
		const snapshot = await getDocs(budgetsRef(userId))
		return snapshot.docs.map((document) => ({id: document.id, ... document.data()}) as Budget)
	},

	async get(userId, budgetId){
		const snapshot = await getDoc(doc(db, "users", userId, "budgets", budgetId))
		return snapshot.exists() ? ({id: snapshot.id, ...snapshot.data()} as Budget) : null
	},

	async create(userId, data){
		await addDoc(budgetsRef(userId), data)
	},

	async update(userId, budgetId, data){
		await updateDoc(doc(db, "users", userId, "budgets", budgetId), data)
	},

	async delete(userId, budgetId){
		await deleteDoc(doc(db, "users", userId, "budgets", budgetId))
	}
}
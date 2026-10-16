import { useEffect, useMemo, useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { firebaseCategoryService } from "@/services/firebase/category.service"
import type { Category } from "@/types"

/**
 * Charge les catégories de l'utilisateur connecté.
 *
 * @returns `categories` : la liste ; `categoryById` : Map id → catégorie, pour retrouver
 * un nom ou une icône depuis un `categoryId` ; `loading` : true tant que la lecture n'est pas terminée
 */
export function useCategories(){
	const {user} = useAuth()
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(()=>{
		if(!user) return
		firebaseCategoryService.list(user.id).then((result)=>{
			setCategories(result)
			setLoading(false)
		})
	},[user])

	const categoryById = useMemo(
		()=> new Map(categories.map((category) => [category.id, category])),[categories]
	)

	return {categories, categoryById, loading}
}


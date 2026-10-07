import { useEffect, useMemo, useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { firebaseCategoryService } from "@/services/firebase/category.service"
import type { Category } from "@/types"

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


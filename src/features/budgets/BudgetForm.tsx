import type { BudgetFormProps } from "@/types/budget";

export function BudgetForm({defaultValues, submitLabel, onSubmit, onCancel}: BudgetFormProps){
	
	return(
		<form onSubmit={handleSubmit(submit)} noValidate>

		</form>
	)
}
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { firebaseCategoryService } from "@/services/firebase/category.service";
import type { BudgetFormProps } from "@/types/budget";
import type { Category } from "@/types/category";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function BudgetForm({
	defaultValues,
	submitLabel,
	onSubmit,
	onCancel,
}: BudgetFormProps) {
	const { user } = useAuth();
	const [categories, setCategories] = useState<Category[]>([]);

	const currentMonth = new Date().toISOString().slice(0, 7); // "2026-10"
	const { register, control, handleSubmit } = useForm({
		defaultValues: { categoryId: "", month: currentMonth, amount: "" },
		// resolver : zodResolver(budgetSchema)
	});

	function submit(values) {
		console.log(values);
	}

	useEffect(() => {
		if (!user) return;
		firebaseCategoryService.list(user.id).then(setCategories);
	}, [user]);

	return (
		<form onSubmit={handleSubmit(submit)} noValidate>
			<FieldSet>
				<FieldGroup>
					{/* Menu select pour la catégorie a laquelle assigner un budget  */}
					<Field>
						<FieldLabel
							htmlFor="categoryId"
							className="text-primary"
						>
							Catégorie
						</FieldLabel>
						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										id="categoryId"
										className="w-full"
									>
										<SelectValue placeholder="Sélectionner" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldDescription>
							A quel catégories voullez vous assigner ce budget?
						</FieldDescription>
					</Field>
					{/* Montant du budget */}
					<Field>
						<FieldLabel htmlFor="amount" className="text-primary">
							Montant
						</FieldLabel>
						<Input
							id="amount"
							type="number"
							step="0.01"
							{...register("amount")}
						/>
						<FieldDescription>
							Le montant en € du budget
						</FieldDescription>
					</Field>
					<Field orientation="horizontal">
						<Button type="submit">Submit</Button>
						<Button variant="outline" type="button">
						Cancel
						</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}

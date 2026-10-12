import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

import type { BudgetFormProps } from "@/types/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
	budgetSchema,
	type BudgetFormInput,
	type BudgetFormValues,
} from "./schemas";
import { useState } from "react";
import { MonthPicker } from "@/components/MonthPicker";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";

export function BudgetForm({
	defaultValues,
	submitLabel,
	onSubmit,
	onCancel,
}: BudgetFormProps) {
	const { categories } = useCategories();
	const [formError, setFormError] = useState<string | null>(null);
	const currentMonth = new Date().toISOString().slice(0, 7); // "2026-10"
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<BudgetFormInput, unknown, BudgetFormValues>({
		defaultValues: {
			categoryId: "",
			month: currentMonth,
			amount: "",
			...defaultValues,
		},
		resolver: zodResolver(budgetSchema),
	});

	async function submit(values: BudgetFormValues) {
		setFormError(null);
		try {
			await onSubmit(values);
		} catch {
			setFormError("Une erreur est survenue, réessaie.");
		}
	}
	console.table(categories)
	return (
		<form onSubmit={handleSubmit(submit)} noValidate>
			<FieldGroup>
				{/* Menu select pour la catégorie a laquelle assigner un budget  */}
				<Field data-invalid={!!errors.categoryId}>
					<FieldLabel htmlFor="categoryId" className="text-primary">
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
									aria-invalid={!!errors.categoryId}
								>
									<SelectValue placeholder="Sélectionner" />
								</SelectTrigger>
								<SelectContent>
									{categories
										.filter((c) => c.type === "expense")
										.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError errors={[errors.categoryId]} />
					<FieldDescription>
						À quelle catégorie voulez-vous assigner ce budget ?
					</FieldDescription>
				</Field>
				{/* Mois auquel appliqué le budget */}
				<Field data-invalid={!!errors.month}>
					<FieldLabel htmlFor="month" className="text-primary">
						Mois
					</FieldLabel>
					<Controller
						control={control}
						name="month"
						render={({ field }) => (
							<MonthPicker
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					<FieldError errors={[errors.month]} />
				</Field>
				{/* Montant du budget */}
				<Field data-invalid={!!errors.amount}>
					<FieldLabel htmlFor="amount" className="text-primary">
						Montant
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							id="amount"
							type="number"
							step="0.01"
							aria-invalid={!!errors.amount}
							{...register("amount")}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>€</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
					<FieldError errors={[errors.amount]} />
					<FieldDescription>
						Le montant en € du budget
					</FieldDescription>
				</Field>
				{formError ? <FieldError>{formError}</FieldError> : null}
				<Field orientation="horizontal">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Enregistrement..." : submitLabel}
					</Button>
					<Button variant="outline" type="button" onClick={onCancel}>
						Annuler
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}

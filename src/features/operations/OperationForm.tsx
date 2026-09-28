import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  operationSchema,
  type OperationFormInput,
  type OperationFormValues,
} from "@/features/operations/schemas"
import { useAuth } from "@/hooks/useAuth"
import { firebaseCategoryService } from "@/services/firebase/category.service"
import type { Category } from "@/types"

function shiftYears(years: number) {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return date.toISOString().slice(0, 10)
}

const TODAY = new Date().toISOString().slice(0, 10)
const MIN_DATE = shiftYears(-5)
const MAX_DATE = shiftYears(5)

interface OperationFormProps {
  defaultValues?: Partial<OperationFormInput>
  submitLabel: string
  onSubmit: (values: OperationFormValues) => Promise<void>
  onCancel: () => void
}

export function OperationForm({ defaultValues, submitLabel, onSubmit, onCancel }: OperationFormProps) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    firebaseCategoryService.list(user.id).then(setCategories)
  }, [user])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OperationFormInput, unknown, OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      type: "expense",
      date: TODAY,
      categoryId: "",
      label: "",
      ...defaultValues,
    },
  })

  async function submit(values: OperationFormValues) {
    setFormError(null)
    try {
      await onSubmit(values)
    } catch {
      setFormError("Une erreur est survenue, réessaie.")
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel className="text-primary">Type</FieldLabel>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <RadioGroup
                className="flex flex-row gap-6"
                value={field.value}
                onValueChange={field.onChange}
              >
                <label className="flex items-center gap-2 text-sm text-primary">
                  <RadioGroupItem value="income" />
                  Revenus
                </label>
                <label className="flex items-center gap-2 text-sm text-primary">
                  <RadioGroupItem value="expense" />
                  Dépenses
                </label>
              </RadioGroup>
            )}
          />
        </Field>

        <Field data-invalid={!!errors.amount}>
          <FieldLabel htmlFor="amount" className="text-primary">Montant</FieldLabel>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00 €"
            aria-invalid={!!errors.amount}
            {...register("amount")}
          />
          <FieldError errors={[errors.amount]} />
        </Field>

        <Field data-invalid={!!errors.categoryId}>
          <FieldLabel htmlFor="categoryId" className="text-primary">Catégorie</FieldLabel>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId" className="w-full" aria-invalid={!!errors.categoryId}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.categoryId]} />
        </Field>

        <Field data-invalid={!!errors.date}>
          <FieldLabel htmlFor="date" className="text-primary">Date</FieldLabel>
          <Input
            id="date"
            type="date"
            min={MIN_DATE}
            max={MAX_DATE}
            aria-invalid={!!errors.date}
            {...register("date")}
          />
          <FieldError errors={[errors.date]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="label" className="text-primary">Libellé</FieldLabel>
          <Input id="label" placeholder="Ex : courses" {...register("label")} />
        </Field>

        {formError ? <FieldError>{formError}</FieldError> : null}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement…" : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

import { X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { OperationForm } from "@/features/operations/OperationForm"
import type { OperationFormValues } from "@/features/operations/schemas"
import { useAuth } from "@/hooks/useAuth"
import { firebaseOperationService } from "@/services/firebase/operation.service"

export function NewOperationPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(values: OperationFormValues) {
    if (!user) return
    await firebaseOperationService.create(user.id, {
      type: values.type,
      amountCents: Math.round(values.amount * 100),
      date: values.date,
      categoryId: values.categoryId,
      label: values.label || null,
    })
    navigate("/operations")
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">Nouvelle opération</h1>
          <Link to="/operations" aria-label="Fermer" className="text-muted-foreground hover:text-primary">
            <X className="size-5" />
          </Link>
        </div>
        <OperationForm submitLabel="Valider" onSubmit={handleSubmit} onCancel={() => navigate("/operations")} />
      </div>
    </div>
  )
}

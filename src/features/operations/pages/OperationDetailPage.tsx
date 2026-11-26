import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadError } from "@/components/LoadError"
import { Button } from "@/components/ui/button"
import { OperationForm } from "@/features/operations/OperationForm"
import type { OperationFormValues } from "@/features/operations/schemas"
import { useAuth } from "@/hooks/useAuth"
import { firebaseOperationService } from "@/services/firebase/operation.service"
import type { Operation } from "@/types"

export function OperationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [operation, setOperation] = useState<Operation | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !id) return
    firebaseOperationService
      .get(user.id, id)
      .then(setOperation)
      .catch(() => setLoadError("Impossible de charger cette opération."))
      .finally(() => setLoading(false))
  }, [user, id])

  async function handleSubmit(values: OperationFormValues) {
    if (!user || !id) return
    await firebaseOperationService.update(user.id, id, {
      type: values.type,
      amountCents: Math.round(values.amount * 100),
      date: values.date,
      categoryId: values.categoryId,
      label: values.label || null,
    })
    navigate("/operations")
  }

  async function handleDelete() {
    if (!user || !id) return
    setDeleteError(null)
    try {
      await firebaseOperationService.softDelete(user.id, id)
      navigate("/operations")
    } catch {
      setDeleteError("La suppression a échoué, réessayez.")
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">Modifier l'opération</h1>
          <Link to="/operations" aria-label="Fermer" className="text-muted-foreground hover:text-primary">
            <X className="size-5" />
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : loadError ? (
          <LoadError message={loadError} />
        ) : !operation ? (
          <p className="text-muted-foreground">Opération introuvable.</p>
        ) : (
          <>
            <OperationForm
              submitLabel="Enregistrer"
              defaultValues={{
                type: operation.type,
                amount: operation.amountCents / 100,
                date: operation.date,
                categoryId: operation.categoryId,
                label: operation.label ?? "",
              }}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/operations")}
            />

            {deleteError ? (
              <p role="alert" className="mt-3 text-sm text-destructive">{deleteError}</p>
            ) : null}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="mt-3 w-full">
                  Supprimer cette opération
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette opération ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    L’opération sera supprimée de votre liste et de vos calculs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDelete}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  )
}

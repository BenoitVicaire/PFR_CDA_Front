import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Message d'échec de chargement avec relance (ENF-F03, P4-03 § 3). */
export function LoadError({ message }: { message: string }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-md border border-destructive bg-danger-100 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-danger-700">
        <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
        {message}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  )
}

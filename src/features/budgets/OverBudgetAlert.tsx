import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { OverBudgetAlertProps } from "@/types/budget";

export function OverBudgetAlert() {
	return (
		<Dialog>
			<DialogTrigger>
				{/* Partie visible qui ouvre la modale au clic */}
				<div className="flex items-center gap-3 rounded-xl border border-warning bg-warning-100 px-3.5 py-3">
					<span className="flex shrink-0 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-white">
						!
					</span>
					<p className="flex-1 text-sm font-medium text-primary">
						2 catégories en dépassement
					</p>
					<span className="shrink-0 text-xs font-semibold text-warning">
						Voir →
					</span>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{/* Titre de la modale */}</DialogTitle>
					<DialogDescription>
						{/* Description grisée de la modale */}
					</DialogDescription>
				</DialogHeader>
				{/* Corps de la modale */}
			</DialogContent>
		</Dialog>
	);
}

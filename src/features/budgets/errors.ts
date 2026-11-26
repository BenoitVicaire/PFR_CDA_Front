// EF-D01 : un seul budget par catégorie et par mois.
export class DuplicateBudgetError extends Error {
	constructor() {
		super("Un budget existe déjà pour cette catégorie sur ce mois. Modifiez-le depuis la liste.");
		this.name = "DuplicateBudgetError";
	}
}

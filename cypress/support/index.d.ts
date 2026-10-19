interface OperationInput {
  type?: "income" | "expense"
  amount: string
  category?: string
  date?: string
  label?: string
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Ouvre la page de connexion et s'authentifie avec le compte de démonstration
     * (ou les identifiants fournis), puis attend l'arrivée sur le dashboard.
     */
    login(email?: string, password?: string): Chainable<void>

    /** Clique sur un lien de la navigation principale (ex. "Opérations", "Dashboard"). */
    navigateTo(label: string): Chainable<void>

    /** Remplit le formulaire d'opération sans le valider. */
    fillOperationForm(operation: OperationInput): Chainable<void>

    /** Choisit une valeur dans une liste déroulante shadcn à partir de l'élément qui la déclenche. */
    selectOption(trigger: string, option: string): Chainable<void>
  }
}

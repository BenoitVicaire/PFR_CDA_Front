/** Fait échouer tous les accès aux données du mode e2e (voir services/memory/store.ts). */
function breakServices() {
  cy.window().then((window) => {
    ;(window as Window & { e2eFailServices?: boolean }).e2eFailServices = true
  })
}

describe("Erreurs de chargement (ENF-F03)", () => {
  beforeEach(() => {
    cy.login()
  })

  it("CT-ERR-01 : la page Budgets affiche l'erreur sans la liste", () => {
    breakServices()
    cy.navigateTo("Budgets")

    cy.get('[role="alert"]').should("contain", "Impossible de charger")
    cy.contains("button", "Réessayer").should("be.visible")
    cy.contains("restants").should("not.exist")
  })

  it("CT-ERR-02 : un échec de suppression d'un budget est signalé", () => {
    cy.navigateTo("Budgets")
    cy.contains("a", "Modifier").click()
    cy.contains("button", "Supprimer ce budget").should("be.visible")
    breakServices()
    cy.contains("button", "Supprimer ce budget").click()
    cy.get('[role="alertdialog"]').contains("button", "Supprimer").click()

    cy.contains("La suppression a échoué").should("be.visible")
    cy.location("pathname").should("match", /\/edit$/)
  })
})

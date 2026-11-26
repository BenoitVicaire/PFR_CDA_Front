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

  const PAGES = [
    { to: "Dashboard", message: "Impossible de charger le tableau de bord." },
    { to: "Opérations", message: "Impossible de charger les opérations." },
    { to: "Catégories", message: "Impossible de charger les catégories." },
  ]

  PAGES.forEach(({ to, message }) => {
    it(`CT-ERR-03 : la page ${to} affiche l'erreur de chargement`, () => {
      cy.navigateTo("Budgets")
      cy.contains("a", "Modifier").should("be.visible")
      breakServices()
      cy.navigateTo(to)

      cy.get('[role="alert"]').should("contain", message)
      cy.contains("button", "Réessayer").should("be.visible")
    })
  })

  it("CT-ERR-04 : un échec de suppression d'une opération est signalé", () => {
    cy.navigateTo("Opérations")
    cy.get("tbody tr a").first().click()
    cy.contains("button", "Supprimer cette opération").should("be.visible")
    breakServices()
    cy.contains("button", "Supprimer cette opération").click()
    cy.get('[role="alertdialog"]').contains("button", "Supprimer").click()

    cy.contains("La suppression a échoué").should("be.visible")
    cy.location("pathname").should("match", /^\/operations\/.+/)
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

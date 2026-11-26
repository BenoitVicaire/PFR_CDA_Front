import { expectNoWcagViolations } from "../support/accessibility"

describe("Budgets (US-014, US-016)", () => {
  beforeEach(() => {
    cy.login()
  })

  it("CT-BUD-03 : n'affiche aucune alerte tant qu'aucun budget n'est dépassé", () => {
    cy.navigateTo("Budgets")
    cy.contains("restants").should("be.visible")

    cy.contains("en dépassement").should("not.exist")
  })

  it("CT-BUD-04 : détaille les dépassements dans une fenêtre titrée et accessible", () => {
    cy.navigateTo("Opérations")
    cy.contains("a", "Ajouter").click()
    cy.fillOperationForm({ type: "expense", amount: "120", category: "Alimentation" })
    cy.contains("button", "Valider").click()
    cy.navigateTo("Budgets")
    cy.contains("button", "1 catégorie en dépassement").click()

    cy.get('[role="dialog"]').within(() => {
      cy.contains("h2", "Alertes de budget")
      cy.contains("tr", "Alimentation").should("contain", "120 %")
      cy.contains("À surveiller").should("not.exist")
    })
    expectNoWcagViolations()
  })
})

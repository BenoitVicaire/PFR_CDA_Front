describe("Budgets (US-014, US-016)", () => {
  beforeEach(() => {
    cy.login()
  })

  it("CT-BUD-03 : n'affiche aucune alerte tant qu'aucun budget n'est dépassé", () => {
    cy.navigateTo("Budgets")
    cy.contains("restants").should("be.visible")

    cy.contains("en dépassement").should("not.exist")
  })
})

function addExpense(amount: string, label: string) {
  cy.navigateTo("Opérations")
  cy.contains("a", "Ajouter").click()
  cy.fillOperationForm({ type: "expense", amount, category: "Alimentation", label })
  cy.contains("button", "Valider").click()
  cy.location("pathname").should("eq", "/operations")
}

describe("Opérations : impact sur le dashboard et les budgets (US-006, US-016)", () => {
  beforeEach(() => {
    cy.login()
  })

  it("CT-OP-17 : met à jour le total des dépenses du mois après une saisie", () => {
    cy.contains("p", /^Dépenses$/).next().should("contain", "800,00")

    addExpense("45.50", "Courses du mois")
    cy.navigateTo("Dashboard")

    cy.contains("p", /^Dépenses$/).next().should("contain", "845,50")
  })

  it("CT-BUD-01 : signale un budget dépassé sur le dashboard", () => {
    addExpense("120", "Gros achats")
    cy.navigateTo("Dashboard")

    cy.contains("1 catégorie en dépassement").should("be.visible")
  })

  it("CT-BUD-02 : signale un budget à surveiller à partir de 80 % du plafond", () => {
    addExpense("85", "Courses importantes")
    cy.navigateTo("Dashboard")

    cy.contains("1 catégorie à surveiller").should("be.visible")
  })
})

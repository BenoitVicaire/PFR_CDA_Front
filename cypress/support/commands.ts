import { DEMO_USER } from "../../src/services/memory/seed"

Cypress.Commands.add("login", (email = DEMO_USER.email, password = DEMO_USER.password) => {
  cy.visit("/connexion")
  cy.get("#email").type(email)
  cy.get("#password").type(password, { log: false })
  cy.contains("button", "Se connecter").click()
  cy.location("pathname").should("eq", "/dashboard")
})

Cypress.Commands.add("navigateTo", (label: string) => {
  cy.contains("header nav a", label).click()
})

Cypress.Commands.add("selectOption", (trigger: string, option: string) => {
  cy.get(trigger).click()
  cy.get('[role="option"]').contains(option).click()
})

Cypress.Commands.add("fillOperationForm", ({ type, amount, category, date, label }: OperationInput) => {
  if (type === "income") cy.contains("label", "Revenus").click()
  if (type === "expense") cy.contains("label", "Dépenses").click()
  cy.get("#amount").clear().type(amount)
  if (category) cy.selectOption("#categoryId", category)
  if (date) cy.get("#date").clear().type(date)
  if (label) cy.get("#label").clear().type(label)
})

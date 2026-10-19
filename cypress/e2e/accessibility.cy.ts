import { expectNoWcagViolations } from "../support/accessibility"

describe("Accessibilité WCAG 2.1 AA (ENF-U04)", () => {
  describe("Structure et sémantique (hors contraste)", () => {
    it("CT-A11Y-01 : la page de connexion est conforme", () => {
      cy.visit("/connexion")
      cy.get("#email").should("be.visible")

      expectNoWcagViolations({ contrast: false })
    })

    it("CT-A11Y-02 : le dashboard est conforme", () => {
      cy.login()
      cy.contains("p", /^Dépenses$/).should("be.visible")

      expectNoWcagViolations({ contrast: false })
    })

    it("CT-A11Y-03 : la liste des opérations est conforme", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("Page 1 /").should("be.visible")

      expectNoWcagViolations({ contrast: false })
    })

    it("CT-A11Y-04 : le formulaire de saisie est conforme", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("a", "Ajouter").click()
      cy.get("#amount").should("be.visible")

      expectNoWcagViolations({ contrast: false })
    })

    it("CT-A11Y-05 : la modale de suppression est conforme", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("tr", "Loyer").find("a").click()
      cy.contains("button", "Supprimer cette opération").click()
      cy.get('[role="alertdialog"]').should("be.visible")

      expectNoWcagViolations({ contrast: false })
    })
  })

  describe("Navigation au clavier", () => {
    it("CT-A11Y-06 : le formulaire de saisie se parcourt avec la touche Tab", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("a", "Ajouter").click()

      cy.get("#amount").focus()
      cy.press(Cypress.Keyboard.Keys.TAB)
      cy.get("#categoryId").should("have.focus")

      cy.get("#label").focus()
      cy.press(Cypress.Keyboard.Keys.TAB)
      cy.contains("button", "Annuler").should("have.focus")
      cy.press(Cypress.Keyboard.Keys.TAB)
      cy.contains("button", "Valider").should("have.focus")
    })
  })

  describe("Contraste des couleurs (ratio 4.5:1)", () => {
    it("CT-A11Y-07 : la page de connexion respecte le ratio 4.5:1", () => {
      cy.visit("/connexion")
      cy.get("#email").should("be.visible")

      expectNoWcagViolations()
    })

    it("CT-A11Y-08 : la liste des opérations respecte le ratio 4.5:1", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("Page 1 /").should("be.visible")

      expectNoWcagViolations()
    })

    it("CT-A11Y-09 : le dashboard respecte le ratio 4.5:1", () => {
      cy.login()
      cy.contains("p", /^Dépenses$/).should("be.visible")

      expectNoWcagViolations()
    })

    it("CT-A11Y-10 : le formulaire de saisie respecte le ratio 4.5:1", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("a", "Ajouter").click()
      cy.get("#amount").should("be.visible")

      expectNoWcagViolations()
    })

    it("CT-A11Y-11 : la modale de suppression respecte le ratio 4.5:1", () => {
      cy.login()
      cy.navigateTo("Opérations")
      cy.contains("tr", "Loyer").find("a").click()
      cy.contains("button", "Supprimer cette opération").click()
      cy.get('[role="alertdialog"]').should("be.visible")

      expectNoWcagViolations()
    })
  })
})

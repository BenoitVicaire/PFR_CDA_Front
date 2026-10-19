describe("Opérations : modification et suppression (US-007, US-008, EF-B02)", () => {
  beforeEach(() => {
    cy.login()
    cy.navigateTo("Opérations")
    cy.contains("tr", "Loyer").find("a").click()
  })

  it("CT-OP-07 : pré-remplit le formulaire puis enregistre la modification", () => {
    cy.contains("h1", "Modifier l'opération").should("be.visible")
    cy.get("#amount").should("have.value", "800")
    cy.get("#label").should("have.value", "Loyer")

    cy.get("#amount").clear().type("950")
    cy.contains("button", "Enregistrer").click()

    cy.location("pathname").should("eq", "/operations")
    cy.contains("tr", "Loyer").should("contain", "950,00")
  })

  it("CT-OP-08 : supprime l'opération après confirmation", () => {
    cy.contains("button", "Supprimer cette opération").click()
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains("Supprimer cette opération ?")
      cy.contains("button", "Supprimer").click()
    })

    cy.location("pathname").should("eq", "/operations")
    cy.contains("Loyer").should("not.exist")
  })

  it("CT-OP-09 : conserve l'opération lorsque la suppression est annulée", () => {
    cy.contains("button", "Supprimer cette opération").click()
    cy.get('[role="alertdialog"]').contains("button", "Annuler").click()

    cy.get('[role="alertdialog"]').should("not.exist")
    cy.location("pathname").should("match", /^\/operations\/.+/)

    cy.get('a[aria-label="Fermer"]').click()
    cy.contains("tr", "Loyer").should("exist")
  })
})

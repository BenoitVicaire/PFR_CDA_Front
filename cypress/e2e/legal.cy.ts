describe("Liens légaux (US-022, EF-G02)", () => {
  it("CT-LEG-01 : le consentement renvoie vers les deux documents", () => {
    cy.visit("/inscription")

    cy.contains("label a", "mentions légales").should("have.attr", "href", "/mentions-legales")
    cy.contains("label a", "politique de confidentialité").should("have.attr", "href", "/politique-confidentialite")
  })

  it("CT-LEG-02 : le pied de page est présent à la connexion et dans l'espace privé", () => {
    cy.visit("/connexion")
    cy.contains("footer a", "Mentions légales").should("exist")

    cy.login()
    cy.contains("footer a", "Politique de confidentialité").should("exist")
  })
})

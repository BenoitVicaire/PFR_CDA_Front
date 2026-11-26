describe("Navigation sur mobile (ENF-C02)", () => {
  beforeEach(() => {
    cy.viewport(375, 812)
    cy.login()
  })

  it("CT-NAV-01 : le menu donne accès aux catégories et aux statistiques", () => {
    cy.get('button[aria-label="Ouvrir le menu"]').click()
    cy.contains('[role="menuitem"]', "Catégories").click()
    cy.location("pathname").should("eq", "/categories")
    // Le menu se ferme avec une animation : le rouvrir avant sa disparition le referme aussitôt.
    cy.get('[role="menu"]').should("not.exist")

    cy.get('button[aria-label="Ouvrir le menu"]').click()
    cy.contains('[role="menuitem"]', "Statistiques").click()
    cy.location("pathname").should("eq", "/statistiques")
  })

  it("CT-NAV-02 : le menu permet de se déconnecter", () => {
    cy.get('button[aria-label="Ouvrir le menu"]').click()
    cy.contains('[role="menuitem"]', "Déconnexion").click()

    cy.location("pathname").should("eq", "/connexion")
  })
})

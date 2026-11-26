/** Aucun élément ne doit dépasser la largeur de l'écran (ENF-C02). */
function expectFitsScreen(selector: string) {
  cy.get(selector).should(($elements) => {
    const width = $elements[0].ownerDocument.documentElement.clientWidth
    $elements.each((_, element) => {
      expect(element.getBoundingClientRect().right, element.textContent ?? selector).to.be.at.most(width)
    })
  })
}

describe("Affichage à 320 px (ENF-C02)", () => {
  beforeEach(() => {
    cy.viewport(320, 640)
    cy.login()
  })

  it("CT-RESP-01 : le montant des opérations reste visible", () => {
    cy.contains("nav a:visible", "Opérations").click()
    cy.contains("Page 1 /").should("be.visible")

    // Pas de défilement horizontal dans le tableau : le montant est entier.
    cy.get('[data-slot="table-container"]').should(($container) => {
      expect($container[0].scrollWidth).to.be.at.most($container[0].clientWidth)
    })
    expectFitsScreen("tbody td:last-child")
    expectFitsScreen('button:contains("Suivant")')
  })

  it("CT-RESP-02 : les boutons des budgets restent à l'écran", () => {
    cy.contains("nav a:visible", "Budgets").click()
    cy.contains("a", "Modifier").should("be.visible")

    expectFitsScreen('a[href="/budgets/new"]')
  })
})

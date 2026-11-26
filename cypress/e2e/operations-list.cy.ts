const MONTH_ABBREVIATIONS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"]

describe("Opérations : consultation (US-009, EF-B03)", () => {
  beforeEach(() => {
    cy.login()
    cy.navigateTo("Opérations")
    cy.contains("Page 1 /").should("be.visible")
  })

  it("CT-OP-10 : trie par défaut de la plus récente à la plus ancienne", () => {
    cy.get("tbody tr").first().should("contain", "Loyer")
    cy.get("tbody tr").eq(1).should("contain", "Salaire du mois")
  })

  it("CT-OP-11 : filtre par catégorie et recalcule le total", () => {
    cy.selectOption('[aria-label="Filtrer par catégorie"]', "Alimentation")

    cy.get("tbody tr").should("have.length", 12)
    cy.contains("Total :").should("contain", "198,00")
  })

  it("CT-OP-12 : filtre par type", () => {
    cy.selectOption('[aria-label="Filtrer par type"]', "Revenus")

    cy.get("tbody tr").should("have.length", 2)
    cy.get("tbody tr").each(($row) => {
      expect($row.text()).to.contain("+")
    })
  })

  it("CT-OP-13 : filtre par mois", () => {
    const currentMonth = MONTH_ABBREVIATIONS[new Date().getMonth()]

    cy.contains("button", "Tous les mois").click()
    cy.contains("button", new RegExp(`^${currentMonth}$`)).click()

    cy.get("tbody tr").should("have.length", 2)
  })

  it("CT-OP-14 : cumule les filtres de mois, de type et de catégorie", () => {
    const currentMonth = MONTH_ABBREVIATIONS[new Date().getMonth()]

    cy.contains("button", "Tous les mois").click()
    cy.contains("button", new RegExp(`^${currentMonth}$`)).click()
    cy.selectOption('[aria-label="Filtrer par type"]', "Dépenses")
    cy.selectOption('[aria-label="Filtrer par catégorie"]', "Logement")

    cy.get("tbody tr").should("have.length", 1).and("contain", "Loyer")
  })

  it("CT-OP-15 : trie par montant décroissant", () => {
    cy.selectOption('[aria-label="Trier les opérations"]', "Montant (décroissant)")

    cy.get("tbody tr").first().should("contain", "Salaire du mois")
    cy.get("tbody tr").first().invoke("text").should("match", /2\s000,00/)
  })

  it("CT-OP-16 : pagine la liste par 25 opérations", () => {
    cy.get("tbody tr").should("have.length", 25)
    cy.contains("Page 1 / 2").should("be.visible")
    cy.contains("button", "Précédent").should("be.disabled")

    cy.contains("button", "Suivant").click()

    cy.get("tbody tr").should("have.length", 5)
    cy.contains("Page 2 / 2").should("be.visible")
    cy.contains("button", "Suivant").should("be.disabled")
  })
})

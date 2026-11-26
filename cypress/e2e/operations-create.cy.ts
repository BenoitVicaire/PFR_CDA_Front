describe("Opérations : saisie (US-006, EF-B01)", () => {
  beforeEach(() => {
    cy.login()
    cy.navigateTo("Opérations")
    cy.contains("a", "Ajouter").click()
    cy.location("pathname").should("eq", "/operations/new")
  })

  it("CT-OP-01 : enregistre une dépense et l'affiche dans la liste", () => {
    cy.fillOperationForm({ type: "expense", amount: "45.50", category: "Alimentation", label: "Courses Carrefour" })
    cy.contains("button", "Valider").click()

    cy.location("pathname").should("eq", "/operations")
    cy.contains("tr", "Courses Carrefour").within(() => {
      cy.contains("Alimentation")
      cy.contains("45,50")
    })
  })

  it("CT-OP-02 : enregistre un revenu avec le signe et la couleur attendus", () => {
    cy.fillOperationForm({ type: "income", amount: "300", category: "Prime", label: "Prime annuelle" })
    cy.contains("button", "Valider").click()

    cy.contains("tr", "Prime annuelle").within(() => {
      cy.contains("+300,00").should("have.class", "text-success")
    })
  })

  it("CT-OP-03 : refuse un montant égal à zéro", () => {
    cy.fillOperationForm({ amount: "0", category: "Alimentation" })
    cy.contains("button", "Valider").click()

    cy.contains("Le montant doit être supérieur à zéro").should("be.visible")
    cy.location("pathname").should("eq", "/operations/new")
  })

  it("CT-OP-04 : exige le choix d'une catégorie", () => {
    cy.fillOperationForm({ amount: "12" })
    cy.contains("button", "Valider").click()

    cy.contains("Catégorie requise").should("be.visible")
    cy.location("pathname").should("eq", "/operations/new")
  })

  it("CT-OP-05 : accepte une date prévisionnelle dans les 5 ans à venir", () => {
    const futureDate = `${new Date().getFullYear() + 2}-06-15`

    cy.fillOperationForm({ amount: "80", category: "Loisirs", date: futureDate, label: "Voyage prévu" })
    cy.contains("button", "Valider").click()

    cy.contains("tr", "Voyage prévu").should("contain", futureDate)
  })

  it("CT-OP-06 : n'enregistre rien lorsque la saisie est annulée", () => {
    cy.fillOperationForm({ amount: "20", category: "Divers", label: "Saisie annulée" })
    cy.contains("button", "Annuler").click()

    cy.location("pathname").should("eq", "/operations")
    cy.contains("Saisie annulée").should("not.exist")
  })
})

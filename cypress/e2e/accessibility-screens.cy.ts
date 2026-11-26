import { expectNoWcagViolations } from "../support/accessibility"

// Complète accessibility.cy.ts : contraste et structure des autres écrans (ENF-U01, ENF-U04).
describe("Accessibilité des autres écrans (ENF-U04)", () => {
  const PUBLIC_PAGES = [
    "/",
    "/inscription",
    "/mot-de-passe-oublie",
    "/mot-de-passe-reset/jeton-de-test",
    "/mentions-legales",
    "/politique-confidentialite",
    "/page-inexistante",
    "/erreur",
  ]

  PUBLIC_PAGES.forEach((path) => {
    it(`CT-A11Y-15 : ${path} est conforme`, () => {
      cy.visit(path)
      cy.get("h1").should("be.visible")

      expectNoWcagViolations()
    })
  })

  const PRIVATE_PAGES = [
    { nav: "Catégories", path: "/categories" },
    { nav: "Statistiques", path: "/statistiques" },
    { nav: "Budgets", path: "/budgets" },
  ]

  PRIVATE_PAGES.forEach(({ nav, path }) => {
    it(`CT-A11Y-16 : ${path} est conforme`, () => {
      cy.login()
      cy.navigateTo(nav)
      cy.location("pathname").should("eq", path)
      cy.contains("Chargement").should("not.exist")

      expectNoWcagViolations()
    })
  })

  it("CT-A11Y-17 : la création d'un budget et son sélecteur de mois sont conformes", () => {
    cy.login()
    cy.navigateTo("Budgets")
    cy.get('a[href="/budgets/new"]').first().click()
    cy.get("#amount").should("be.visible")
    expectNoWcagViolations()

    cy.get("button#month").click()
    cy.contains("button", "Jan").should("be.visible")
    expectNoWcagViolations()
  })

  it("CT-A11Y-18 : la modification d'un budget est conforme", () => {
    cy.login()
    cy.navigateTo("Budgets")
    cy.contains("a", "Modifier").click()
    cy.contains("button", "Supprimer ce budget").should("be.visible")

    expectNoWcagViolations()
  })

  it("CT-A11Y-20 : sur mobile, la navigation, le menu et la page Profil sont conformes", () => {
    cy.viewport(375, 812)
    cy.login()
    cy.contains("p", /^Dépenses$/).should("be.visible")
    expectNoWcagViolations()

    cy.get('button[aria-label="Ouvrir le menu"]').click()
    cy.get('[role="menu"]').should("be.visible")
    // La page Profil n'est accessible sur mobile que par ce menu.
    cy.contains('[role="menuitem"]', "Profil").click()
    cy.get('[role="menu"]').should("not.exist")
    cy.contains("h1", "Profil").should("be.visible")
    expectNoWcagViolations()
  })

  it("CT-A11Y-21 : le message d'échec de chargement est conforme", () => {
    cy.login()
    cy.navigateTo("Budgets")
    cy.contains("a", "Modifier").should("be.visible")
    cy.window().then((window) => {
      ;(window as Window & { e2eFailServices?: boolean }).e2eFailServices = true
    })
    cy.navigateTo("Opérations")
    cy.get('[role="alert"]').should("be.visible")

    expectNoWcagViolations()
  })

  it("CT-A11Y-19 : les messages de validation sont conformes", () => {
    cy.visit("/inscription")
    cy.contains("button", "Créer mon compte").click()
    cy.contains("Email requis").should("be.visible")

    expectNoWcagViolations()
  })
})

import { DEMO_USER } from "../../src/services/memory/seed"

function fillRegisterForm(email: string) {
  cy.get("#email").type(email)
  cy.get("#password").type("Test-Inscription-2026!", { log: false })
  cy.get("#confirmPassword").type("Test-Inscription-2026!", { log: false })
  cy.get('[role="checkbox"]').click()
}

/** Voir services/memory/store.ts. */
function setFailingServices(failing: boolean) {
  cy.window().then((window) => {
    ;(window as Window & { e2eFailServices?: boolean }).e2eFailServices = failing
  })
}

describe("Authentification (prérequis du fil rouge)", () => {
  it("CT-AUTH-01 : connecte l'utilisateur avec des identifiants valides", () => {
    cy.visit("/connexion")
    cy.get("#email").type(DEMO_USER.email)
    cy.get("#password").type(DEMO_USER.password, { log: false })
    cy.contains("button", "Se connecter").click()

    cy.location("pathname").should("eq", "/dashboard")
  })

  it("CT-AUTH-02 : affiche un message générique si les identifiants sont invalides", () => {
    cy.visit("/connexion")
    cy.get("#email").type(DEMO_USER.email)
    cy.get("#password").type("MauvaisMotDePasse1!", { log: false })
    cy.contains("button", "Se connecter").click()

    cy.contains("Email ou mot de passe incorrect.").should("be.visible")
    cy.location("pathname").should("eq", "/connexion")
  })

  it("CT-AUTH-06 : revient à la page demandée après la connexion", () => {
    cy.visit("/operations")
    cy.location("pathname").should("eq", "/connexion")
    cy.get("#email").type(DEMO_USER.email)
    cy.get("#password").type(DEMO_USER.password, { log: false })
    cy.contains("button", "Se connecter").click()

    cy.contains("h1", "Opérations").should("be.visible")
    cy.location("pathname").should("eq", "/operations")
  })

  it("CT-AUTH-04 : inscrit un nouveau compte avec ses 12 catégories", () => {
    cy.visit("/inscription")
    fillRegisterForm("nouveau@exemple.test")
    cy.contains("button", "Créer mon compte").click()

    cy.location("pathname").should("eq", "/dashboard")
    cy.navigateTo("Catégories")
    cy.get("main li").should("have.length", 12)
  })

  it("CT-AUTH-05 : un échec en cours d'inscription ne laisse pas de compte incomplet", () => {
    cy.visit("/inscription")
    fillRegisterForm("reprise@exemple.test")
    setFailingServices(true)
    cy.contains("button", "Créer mon compte").click()

    cy.contains("Une erreur est survenue").should("be.visible")
    cy.location("pathname").should("eq", "/inscription")

    // La même adresse reste disponible : le compte à moitié créé a été supprimé.
    setFailingServices(false)
    cy.contains("button", "Créer mon compte").click()
    cy.location("pathname").should("eq", "/dashboard")
  })

  it("CT-AUTH-03 : redirige un visiteur non connecté vers la page de connexion", () => {
    cy.visit("/operations")

    cy.location("pathname").should("eq", "/connexion")
    cy.location("search").should("contain", "redirect=%2Foperations")
  })
})

import { DEMO_USER } from "../../src/services/memory/seed"

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

  it("CT-AUTH-03 : redirige un visiteur non connecté vers la page de connexion", () => {
    cy.visit("/operations")

    cy.location("pathname").should("eq", "/connexion")
    cy.location("search").should("contain", "redirect=%2Foperations")
  })
})

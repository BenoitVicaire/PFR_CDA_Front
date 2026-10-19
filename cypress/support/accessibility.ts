import type { Result } from "axe-core"

const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

function logViolations(violations: Result[]) {
  cy.task(
    "table",
    violations.map(({ id, impact, nodes, help }) => ({
      règle: id,
      impact,
      éléments: nodes.length,
      description: help,
    })),
  )
}

interface WcagOptions {
  /** Inclut la règle de contraste des couleurs (ratio 4.5:1). Activée par défaut. */
  contrast?: boolean
}

/**
 * Analyse la page courante avec axe-core selon les critères WCAG 2.1 niveau A et AA.
 * Le test échoue dès qu'une règle est violée et le détail est affiché dans la console du terminal.
 * @param options Permet de désactiver la règle de contraste, traitée dans un test séparé.
 */
export function expectNoWcagViolations({ contrast = true }: WcagOptions = {}) {
  cy.injectAxe()
  cy.checkA11y(
    undefined,
    {
      runOnly: { type: "tag", values: WCAG_AA_TAGS },
      rules: { "color-contrast": { enabled: contrast } },
    },
    logViolations,
  )
}

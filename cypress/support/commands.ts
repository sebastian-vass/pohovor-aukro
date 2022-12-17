/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    selectParametersByCheckbox(parameters: string[], parameterBox: string): Chainable<void>
  }
}

Cypress.Commands.add('selectParametersByCheckbox', (parameters: string[], parameterBox: string) => {
  cy.intercept('POST', 'https://backend.aukro.cz/backend-web/api/measurement/show').as('showProductAfterFiltering')

  cy.get(parameterBox).then((parameterFilter) => {
    parameters.forEach((parameter) => {
      cy.wrap(Cypress.$('li', parameterFilter)).contains(parameter).click()
      cy.wait('@showProductAfterFiltering')
    })
  })
})

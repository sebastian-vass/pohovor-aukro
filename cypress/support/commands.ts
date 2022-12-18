/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    selectParametersByCheckbox(parameters: string[], parameterBox: string): Chainable<void>
    checkNumberOfBudges(): Chainable<void>
  }
}

Cypress.Commands.add('selectParametersByCheckbox', (parameters: string[], parameterBox: string) => {
  cy.intercept('POST', 'https://backend.aukro.cz/backend-web/api/measurement/show').as('showProductAfterFiltering')

  cy.get(parameterBox).then((parameterFilter) => {
    parameters.forEach((parameter) => {
      cy.wrap(Cypress.$('li', parameterFilter)).contains(parameter).click()
      cy.wait('@showProductAfterFiltering')
    })
    cy.url().should('include', '?paymentViaAukro=true')
  })
})

Cypress.Commands.add('checkNumberOfBudges', () => {
  cy.get('auk-list-card').then((card) => {
    cy.wrap(Cypress.$('span > auk-svg-icon-legacy#money-back-guarantee2', card)).then((moneyBack) => {
      if (card.length === (moneyBack.length / 2)) {
        cy.log('All products have badges: Garance vrácení peněz')
      } else {
        cy.log(`The numbers dont match. Badges number: ${moneyBack.length / 2} card number: ${card.length}`)
      }
    })
  })
})

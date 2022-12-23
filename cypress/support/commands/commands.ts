/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getSupplyDetail(cardNumber: number): Chainable<void>
    acceptGDPR(): Chainable<void>
  }
}

Cypress.Commands.add('getSupplyDetail', (cardNumber: number) => {
  // If there is an even number of products, select a random product else select the middle one.
  if ((cardNumber % 2) === 0) {
    cy.get('auk-list-card > div > a').eq(Math.floor(Math.random() * cardNumber))
      .scrollIntoView()
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href)
      })
  } else {
    cy.get('auk-list-card > div > a').eq(Math.ceil(cardNumber / 2))
      .scrollIntoView()
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href)
      })
  }
})

Cypress.Commands.add('acceptGDPR', () => {
  cy.intercept('GET', '/sid/json?**').as('gdpr')
  cy.get('#didomi-notice-agree-button').click()
  cy.wait('@gdpr')
})

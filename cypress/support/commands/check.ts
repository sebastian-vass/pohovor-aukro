/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    checkBasket(): Chainable<void>
    checkBudgesOnDetailProduct(budges: any): Chainable<void>
    checkNumberOfBudges(card: any): Chainable<void>
  }
}

Cypress.Commands.add('checkBasket', () => {
  // Check if product was successfully added to shopping card. (Status length > 0)
  // If wasn`t, then print error with text of toast. (Status length === 0)
  cy.document().then(doc => {
    if (doc.querySelectorAll('auk-basket-control > div.dropdown-submenu').length > 0) {
      cy.log('Product was successfully added to your shopping cart.')
      return false
    } else {
      cy.get('auk-toast > .tw-rounded')
        .invoke('text')
        .then(text => {
          cy.log('Product has not been added to your cart. Issue with: ' + text)
          return false
        })
    }
  })
})

Cypress.Commands.add('checkBudgesOnDetailProduct', (budges: any) => {
  cy.get(budges.bannerAttribute)
    .should('be.visible')
    .then((banner) => {
      expect(banner).to.have.length(1)
      cy.wrap(Cypress.$(budges.iconId, banner)).should('be.visible')
    })
})

Cypress.Commands.add('checkNumberOfBudges', (card) => {
  cy.wrap(Cypress.$('span > auk-svg-icon-legacy#money-back-guarantee2', card))
    .then((moneyBack) => {
      if (card.length === (moneyBack.length / 2)) {
        cy.log('All products have badges: Garance vrácení peněz')
      } else {
        cy.log(`The numbers dont match. Badges number: ${moneyBack.length / 2} card number: ${card.length}`)
      }
    })
})

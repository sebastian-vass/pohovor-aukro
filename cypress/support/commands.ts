/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    selectParametersByCheckbox(parameters: string[], parameterBox: string): Chainable<void>
    checkNumberOfBudges(card, cardNumber: number): Chainable<void>
    getSupplyDetail(cardNumber: number): Chainable<void>
    checkBudgesOnDetailProduct(budges: any): Chainable<void>
    makeBuyNow(): Chainable<void>
    makeAddPrice(): Chainable<void>
    checkBasket(): Chainable<void>
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

Cypress.Commands.add('checkNumberOfBudges', (card, cardNumber: number) => {
  cy.wrap(Cypress.$('span > auk-svg-icon-legacy#money-back-guarantee2', card))
    .then((moneyBack) => {
      if (cardNumber === (moneyBack.length / 2)) {
        cy.log('All products have badges: Garance vrácení peněz')
      } else {
        cy.log(`The numbers dont match. Badges number: ${moneyBack.length / 2} card number: ${cardNumber}`)
      }
    })
})

Cypress.Commands.add('getSupplyDetail', (cardNumber: number) => {
  if ((cardNumber % 0) === 0) {
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

Cypress.Commands.add('checkBudgesOnDetailProduct', (budges: any) => {
  cy.get(budges.bannerAttribute)
    .should('be.visible')
    .then((banner) => {
      expect(banner).to.have.length(1)
      cy.wrap(Cypress.$(budges.iconId, banner)).should('be.visible')
    })
})

Cypress.Commands.add('makeBuyNow', () => {
  cy.intercept('POST', '**/backend-web/api/cart/item').as('addProductToBasket')
  cy.get('.auk-button-content').contains('Koupit').click()
  cy.wait('@addProductToBasket')
})

Cypress.Commands.add('makeAddPrice', () => {
  cy.intercept('POST', '**/backend-web/api/offers/**/bid?fastBid=true').as('fastBid')
  cy.get('.auk-button-content').contains('Přihodit').click()
  cy.wait('@fastBid')
})

Cypress.Commands.add('checkBasket', () => {
  // Check if product was successfully added to shopping card. (Status length > 0)
  // If wasn`t, then print error with text of toast. (Status length === 0)
  cy.document().then(doc => {
    if (doc.querySelectorAll('auk-basket-control > div.dropdown-submenu').length > 0) {
      cy.log('Product was successfully added to your shopping cart.').end()
    } else {
      cy.get('auk-toast > .tw-rounded')
        .invoke('text')
        .then(text => {
          cy.log('Product has not been added to your cart. Issue with: ' + text).end()
        })
    }
  })
})

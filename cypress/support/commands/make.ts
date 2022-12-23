/// <reference types="cypress" />
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    makeAddPrice(): Chainable<void>
    makeBidToAuction(): Chainable<void>
    makeBuyNow(): Chainable<void>
    makeBuyRightNow(): Chainable<void>
  }
}

Cypress.Commands.add('makeAddPrice', () => {
  cy.intercept('POST', '**/backend-web/api/offers/**/bid?fastBid=true').as('fastBid')
  cy.get('.auk-button-content').contains('Přihodit').click()
  cy.wait('@fastBid')
})

Cypress.Commands.add('makeBuyNow', () => {
  cy.intercept('POST', '**/backend-web/api/cart/item').as('addProductToBasket')
  cy.get('.auk-button-content').contains('Koupit').click()
  cy.wait('@addProductToBasket')
})

Cypress.Commands.add('makeBidToAuction', () => {
  cy.get('auk-item-detail-main-item-panel-price > div > auk-icon-with-text > div > span').invoke('text').then((price) => {
    const NEW_PRICE: string = String(Math.floor((Number(price.replace(/\s/g, '').replace('Kč', '')) * 1.2)))
    cy.get('auk-item-detail-number-input').then((detailInputBox) => {
      cy.wrap(Cypress.$('input', detailInputBox)).clear().type(NEW_PRICE)
      cy.makeAddPrice()
      cy.get('auk-dialog-content > div > p').should('be.visible').and('have.text', 'Pro příhoz v aukci se přihlaste k vašemu Aukro účtu nebo si jej jednoduše vytvořte')
    })
  })
})

Cypress.Commands.add('makeBuyRightNow', () => {
  // After click on button buy, shows error toast.
  cy.makeBuyNow()
  cy.get('auk-toast').contains('Tento produkt se dá koupit jen pomocí Platby přes Aukro. K jeho koupi se, prosím, přihlaste.').should('be.visible')
})

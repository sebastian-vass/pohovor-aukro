describe('Aukro task assignment', () => {
  const PARAMETERS: string[] = ['Garance vrácení peněz']
  const SUPPLY_NUMBER: number = 4
  const PAYMENT_BANNER: object = {
    bannerAttribute: 'auk-banner-payment-via-aukro',
    iconId: '#money-back-guarantee'
  }

  before(() => {
    cy.intercept('GET', '/sid/json?**').as('gdpr')
    cy.visit('/')
    // cy.visit('/5-kc-1927-vzacna-7026192127') // aukce
    // cy.visit('/harry-potter-brumbal-hulka-strilejici-ohen-7023320319') // kup ted with some issue
    // cy.visit('/hhc-0-5ml-7024829802') // kup ted correct
    cy.get('#didomi-notice-agree-button').click()
    cy.wait('@gdpr')
  })

  it('Get menu', () => {
    cy.get('.main-menu').then((mainMenu) => {
      cy.wrap(Cypress.$('auk-top-level-category > div > a ', mainMenu))
        .each((category) => {
          cy.wrap(category)
            .invoke('attr', 'href')
            .then(href => {
              if (!href.includes('/stranka')) { //
                cy.visit(href)
                cy.selectParametersByCheckbox(PARAMETERS, 'auk-simple-filter-checkbox > div > ul')
                cy.get('.details > span')
                  .invoke('text')
                  .then((supplyPageNumber) => {
                    if (Number(supplyPageNumber.replace(/\s/g, '')) > SUPPLY_NUMBER) {
                      cy.scrollTo('bottom', { duration: 5000 })
                      cy.get('auk-list-card').then((card) => {
                        const CARD_NUMBER: number = card.length

                        cy.checkNumberOfBudges(card, CARD_NUMBER)
                        cy.getSupplyDetail(CARD_NUMBER)
                        cy.checkBudgesOnDetailProduct(PAYMENT_BANNER)

                        cy.get('auk-countdown-panel > div > div:first')
                          .invoke('text')
                          .then((typeOfSupply) => {
                            if (typeOfSupply.match('Kup teď')) {
                              cy.makeBuyNow()
                              cy.checkBasket()
                            } else if (typeOfSupply.match('Aukce')) {
                              cy.get('auk-item-detail-main-item-panel-price > div > auk-icon-with-text > div > span').invoke('text').then((price) => {
                                const NEW_PRICE: string = String((Number(price.replace(/\s/g, '').replace('Kč', '')) * 1.2))
                                cy.get('auk-item-detail-number-input').then((detailInputBox) => {
                                  cy.wrap(Cypress.$('input', detailInputBox)).clear().type(NEW_PRICE)
                                  cy.makeAddPrice()
                                  cy.get('auk-dialog-content > div > p').should('be.visible').and('have.text', 'Pro příhoz v aukci se přihlaste k vašemu Aukro účtu nebo si jej jednoduše vytvořte')
                                })
                              })
                            }
                          })
                      })
                    }
                  })
              }
            })
        })
    })
  })
})

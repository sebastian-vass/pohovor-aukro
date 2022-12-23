describe('Aukro task assignment', () => {
  const PARAMETERS: string[] = ['Garance vrácení peněz']
  const SUPPLY_NUMBER: number = 4
  const PAYMENT_BANNER: object = {
    bannerAttribute: 'auk-banner-payment-via-aukro',
    iconId: '#money-back-guarantee'
  }
  let nextPass: boolean = true

  before(() => {
    cy.visit('/')
    cy.acceptGDPR()
  })

  function selectRightCategory (visitedCategory: number, totalCategories: number): any {
    if (visitedCategory <= totalCategories) {
      if (nextPass) {
        cy.get('.main-menu > auk-top-level-category > div > a ').eq(visitedCategory)
          .invoke('attr', 'href').then((href) => {
            if (!href.includes('/stranka') && nextPass) {
              cy.visit(href)
              cy.selectParametersByCheckbox(PARAMETERS, 'auk-simple-filter-checkbox > div > ul')
              cy.get('.details > span')
                .invoke('text')
                .then((supplyPageNumber) => {
                  nextPass = Number(supplyPageNumber.replace(/\s/g, '')) < SUPPLY_NUMBER
                })
            }
            visitedCategory++
            return selectRightCategory(visitedCategory, totalCategories)
          })
      }
    } else {
      cy.log('**None of the categories has a minimum number of compliant bids.**')
        .should('have.text', 'Manually triggered error')
    }
  }

  it('Selecting the correct category based on the task', () => {
    cy.get('.main-menu > auk-top-level-category > div > a ').then((categories) => {
      selectRightCategory(0, (Cypress.$(categories).length - 1))
    })
  })

  it('Selecting product detail based on conditions', () => {
    cy.scrollTo('bottom', { duration: 5000 })
    cy.get('auk-list-card').then((card) => {
      const CARD_NUMBER: number = card.length
      cy.checkNumberOfBudges(card, CARD_NUMBER)
      cy.getSupplyDetail(CARD_NUMBER)
    })
  })

  it('Check the badge "Garance vrácení peněz" on the product detail.', () => {
    cy.checkBudgesOnDetailProduct(PAYMENT_BANNER)
  })

  it('Based on the terms and conditions, purchase or bid into the auction.', () => {
    cy.get('auk-countdown-panel > div > div:first')
      .invoke('text')
      .then((typeOfSupply) => {
        if (typeOfSupply.match('Kup teď')) {
          cy.makeBuyNow()
          cy.checkBasket()
        } else if (typeOfSupply.match('Aukce')) {
          cy.document().then(doc => {
            if (doc.querySelectorAll('auk-item-detail-bidding-buy-now > div auk-button > button').length > 0) {
              (Math.random() < 0.5) ? cy.makeBuyRightNow() : cy.makeBidToAuction()
            } else {
              cy.makeBidToAuction()
            }
          })
        }
      })
  })
})

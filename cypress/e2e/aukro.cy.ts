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
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  function selectRightCategory (visitedCategory: number, totalCategories: number): any {
    if (visitedCategory <= totalCategories) { // Check if we are in range of Categories
      if (nextPass) { // Check if to continue
        cy.get('.main-menu > auk-top-level-category > div > a ')
          .eq(visitedCategory)
          .invoke('attr', 'href').then((href) => {
            if (!href.includes('/stranka') && nextPass) { // There are sites in the list that we ignore. Do not contain products.
              cy.visit(href)
              cy.selectParametersByCheckbox(PARAMETERS, 'auk-simple-filter-checkbox > div > ul')
              cy.get('.details > span')
                .invoke('text')
                .then((supplyPageNumber) => {
                  nextPass = Number(supplyPageNumber.replace(/\s/g, '')) < SUPPLY_NUMBER // Check if the category has more than 4 bids.
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
    cy.get('.main-menu > auk-top-level-category > div > a ')
      .then((categories) => {
        selectRightCategory(0, (Cypress.$(categories).length - 1))
      })
  })

  it('Selecting product detail based on conditions', () => {
    cy.scrollTo('bottom', { duration: 5000 })
    cy.get('auk-list-card')
      .then((listOfCards) => {
        cy.checkNumberOfBudges(listOfCards)
        cy.getSupplyDetail(listOfCards.length)
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
          cy.document()
            .then(doc => {
            // If the product (auction) detail contains a Buy button, make a random selection between Auction and Buy.
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

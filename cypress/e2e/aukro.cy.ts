describe('Aukro task assignment', () => {
  const PARAMETERS: string[] = ['Garance vrácení peněz']
  const SUPPLY_NUMBER: number = 4

  before(() => {
    cy.intercept('GET', '/sid/json?**').as('gdpr')
    cy.visit('/')
    cy.get('#didomi-notice-agree-button').click()
    cy.wait('@gdpr')
  })

  it('Get menu', () => {
  })

  it.only('Get menu', () => {
    cy.get('.main-menu').then((mainMenu) => {
      cy.wrap(Cypress.$('auk-top-level-category > div > a ', mainMenu))
        .eq(1) // Necessary for debugging
        .each((category) => {
          cy.wrap(category)
            .invoke('attr', 'href')
            .then(href => {
              if (!href.includes('/stranka')) {
                cy.visit(href)
                cy.selectParametersByCheckbox(PARAMETERS, 'auk-simple-filter-checkbox > div > ul')
                cy.get('.details > span').invoke('text').then((supplyPageNumber) => {
                  if (Number(supplyPageNumber.replace(/\s/g, '')) > SUPPLY_NUMBER) {
                    cy.scrollTo('bottom', { duration: 5000 })
                    cy.get('auk-list-card').then((card) => {
                      const CARD_NUMBER: number = card.length

                      cy.checkNumberOfBudges(card, CARD_NUMBER)
                      cy.getSupplyDetail(CARD_NUMBER)
                    })
                  }
                })
              }
            })
        })
    })
  })
})

describe('Aukro task assignment', () => {
  const PARAMETERS = ['Garance vrácení peněz']

  before(() => {
    cy.intercept('GET', '/sid/json?**').as('gdpr')
    cy.visit('/')
    cy.get('#didomi-notice-agree-button').click()
    cy.wait('@gdpr')
  })

  it('Get menu', () => {
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
              }
            })
        })
    })
  })
})

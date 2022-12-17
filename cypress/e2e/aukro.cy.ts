describe('Aukro task assignment', () => {
  before(() => {
    cy.intercept('GET', '/sid/json?**').as('gdpr')
    cy.visit('/')
    cy.get('#didomi-notice-agree-button').click()
    cy.wait('@gdpr')
  })

  it('', () => {
  })
})

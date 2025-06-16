describe('Inloggen', () => {
  it('Logt succesvol in met geldige gegevens en gaat naar productoverzicht', () => {
    // Open loginpagina
    cy.visit('http://localhost:5173/login') // pas aan als je andere poort gebruikt

    // Vul gebruikersnaam en wachtwoord in
    cy.get('input#username').type('admin5')
    cy.get('input#password').type('test5')

    // Klik op de inlogknop
    cy.get('button[type="submit"]').click()

    // Controleer of we doorgestuurd worden naar /producten
    cy.url().should('include', '/producten')

    // Controleer of productoverzicht geladen is
    cy.contains('Productoverzicht') // of een ander herkenbaar element op die pagina
  })
})

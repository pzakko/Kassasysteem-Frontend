describe('Productbeheer', () => {
  const gebruikersnaam = 'admin5'
  const wachtwoord = 'test5'

  const nieuwProduct = {
    naam: 'Testbroek Cypress',
    prijs: '33.00',
    voorraad: '33',
    categorie: 'Broeken',
    beschrijving: 'Testbeschrijving',
    afbeelding: ''
  }

  beforeEach(() => {
    cy.viewport(1280, 800)
    cy.visit('http://localhost:5173/login')
    cy.get('input#username').type(gebruikersnaam)
    cy.get('input#password').type(wachtwoord)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/producten')
  })

  it('Voegt nieuw product toe en verwijdert het daarna', () => {
    // Toevoegen
    cy.get('[data-testid="naam"]').type(nieuwProduct.naam)
    cy.get('[data-testid="prijs"]').type(nieuwProduct.prijs)
    cy.get('[data-testid="voorraad"]').type(nieuwProduct.voorraad)
    cy.get('[data-testid="categorie"]').type(nieuwProduct.categorie)
    cy.get('[data-testid="beschrijving"]').type(nieuwProduct.beschrijving)
    if (nieuwProduct.afbeelding) {
      cy.get('[data-testid="afbeelding"]').type(nieuwProduct.afbeelding)
    }
    cy.contains('Toevoegen').click()

    // Wacht op WebSocket-reactie
    cy.wait(1000)

    // ✅ Check of hij bestaat
    cy.contains(nieuwProduct.naam).should('exist')

    // ❌ Verwijderen
    cy.contains(nieuwProduct.naam)
      .closest('.product-card')
      .within(() => {
        cy.get('button').contains(/verwijder/i).click({ force: true })
      })

    // ✅ Controleer dat hij niet meer zichtbaar is
    cy.wait(1000) // wacht op WebSocket die frontend update
    cy.contains(nieuwProduct.naam).should('not.exist')
  })
})

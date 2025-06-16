// describe('Productbeheer', () => {
//   const gebruikersnaam = 'admin5'
//   const wachtwoord = 'test5'

//   const nieuwProduct = {
//     naam: 'Testbroek Cypress',
//     prijs: '33.00',
//     voorraad: '33',
//     categorie: 'Broeken',
//     beschrijving: 'Testbeschrijving',
//     afbeelding: ''
//   }

//   beforeEach(() => {
//     // Login
//     cy.visit('http://localhost:5173/login')
//     cy.get('input#username').type(gebruikersnaam)
//     cy.get('input#password').type(wachtwoord)
//     cy.get('button[type="submit"]').click()

//     // Zorg dat we op het productoverzicht belanden
//     cy.url().should('include', '/producten')
//   })

//   it('Voegt een nieuw product toe', () => {
//     // Vul formulier in
//     cy.get('[data-testid="naam"]').type(nieuwProduct.naam)
//     cy.get('[data-testid="prijs"]').type(nieuwProduct.prijs)
//     cy.get('[data-testid="voorraad"]').type(nieuwProduct.voorraad)
//     cy.get('[data-testid="categorie"]').type(nieuwProduct.categorie)
//     cy.get('[data-testid="beschrijving"]').type(nieuwProduct.beschrijving)
//     if (nieuwProduct.afbeelding) {
//       cy.get('[data-testid="afbeelding"]').type(nieuwProduct.afbeelding)
//     }

//     cy.contains('Toevoegen').click()

//     // Wacht even op WebSocket-update
//     cy.wait(1000)

//     // Controleer of hij zichtbaar is
//     cy.contains(nieuwProduct.naam).should('exist')
//   })

//   it('Verwijdert het product weer (als knop aanwezig)', () => {
//     cy.wait(1000)

//     cy.contains(nieuwProduct.naam)
//       .parent()
//       .within(() => {
//         cy.get('button').contains(/verwijder/i).click({ force: true })
//       })

//     // Controleer dat het verdwenen is
//     cy.contains(nieuwProduct.naam).should('not.exist')
//   })
// })


// describe('Productbeheer', () => {
//   const adminGebruiker = 'admin5';
//   const wachtwoord = 'test5';

//   const nieuwProduct = {
//     naam: 'Testbroek Cypress',
//     prijs: 33.00,
//     voorraad: 33,
//     categorie: 'Broeken',
//     beschrijving: 'Testbeschrijving',
//     afbeelding: ''
//   };

//   before(() => {
//     // Login
//     cy.visit('http://localhost:5173/login');
//     cy.get('input#username').type(adminGebruiker);
//     cy.get('input#password').type(wachtwoord);
//     cy.get('button[type="submit"]').click();

//     // Verifieer dat we doorgestuurd worden
//     cy.url().should('include', '/producten');
//   });

//   it('Voegt nieuw product toe', () => {
//     cy.get('input[placeholder="Zoek producten..."]').should('exist'); // Even check dat pagina geladen is

//     cy.get('input').eq(0).clear().type(nieuwProduct.naam);
//     cy.get('input[type="number"]').eq(0).clear().type(nieuwProduct.prijs.toString());
//     cy.get('input[type="number"]').eq(1).clear().type(nieuwProduct.voorraad.toString());
//     cy.get('input').eq(3).clear().type(nieuwProduct.categorie);
//     cy.get('textarea').clear().type(nieuwProduct.beschrijving);
//     cy.get('input').eq(4).clear().type(nieuwProduct.afbeelding);
    
//     cy.contains('Toevoegen').click();

//     // Bevestig dat het nieuwe product zichtbaar is
//     cy.contains(nieuwProduct.naam).should('exist');
//     cy.contains(`€${nieuwProduct.prijs.toFixed(2)}`).should('exist');
//     cy.contains(`Voorraad: ${nieuwProduct.voorraad}`).should('exist');
//   });

//   it('Verwijdert het product weer', () => {
//     // Zoek de kaart waarin het product staat en klik op de verwijderknop
//     cy.contains(nieuwProduct.naam)
//       .parentsUntil('body') // Zoek omhoog naar de kaart
//       .contains('Verwijderen')
//       .click({ force: true });

//     // Controleer dat het product is verdwenen
//     cy.contains(nieuwProduct.naam).should('not.exist');
//   });
// });




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
    // Zorg dat we in desktopweergave testen
    cy.viewport(1280, 800)

    // Ga naar loginpagina
    cy.visit('http://localhost:5173/login')

    // Vul logingegevens in
    cy.get('input#username').type(gebruikersnaam)
    cy.get('input#password').type(wachtwoord)
    cy.get('button[type="submit"]').click()

    // Controleer dat we op het dashboard zijn
    cy.url().should('include', '/producten')
  })

  it('Voegt nieuw product toe en verwijdert het daarna', () => {
    // Vul het formulier in
    cy.get('[data-testid="naam"]').type(nieuwProduct.naam)
    cy.get('[data-testid="prijs"]').type(nieuwProduct.prijs)
    cy.get('[data-testid="voorraad"]').type(nieuwProduct.voorraad)
    cy.get('[data-testid="categorie"]').type(nieuwProduct.categorie)
    cy.get('[data-testid="beschrijving"]').type(nieuwProduct.beschrijving)

    if (nieuwProduct.afbeelding) {
      cy.get('[data-testid="afbeelding"]').type(nieuwProduct.afbeelding)
    }

    // Klik op Toevoegen
    cy.contains('Toevoegen').click()

    // Wacht op WebSocket of API-update
    cy.wait(1000)
    cy.contains(nieuwProduct.naam).should('not.exist')

    // Controleer of product zichtbaar is
    cy.contains(nieuwProduct.naam).should('exist')

    // Zoek de productkaart en klik op verwijderen
    cy.contains(nieuwProduct.naam)
      .closest('.product-card')
      .within(() => {
        cy.get('[data-testid="verwijder-knop"]').click({ force: true })
      })

    // Controleer of het product is verwijderd
    cy.contains(nieuwProduct.naam).should('not.exist')
  })
})


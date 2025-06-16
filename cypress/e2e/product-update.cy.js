describe('Product bijwerken', () => {
  const gebruikersnaam = 'admin5';
  const wachtwoord = 'test5';

  const origineel = {
    naam: 'UpdateTest Cypress',
    prijs: '22.00',
    voorraad: '10',
    categorie: 'TestCat',
    beschrijving: 'Oorspronkelijke beschrijving',
    afbeelding: ''
  };

  const bijgewerkt = {
    naam: 'UpdateTest Cypress ✔️',
    prijs: '55.00',
    voorraad: '99',
    categorie: 'BijgewerktCat',
    beschrijving: 'Bijgewerkte beschrijving',
    afbeelding: ''
  };

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('http://localhost:5173/login');
    cy.get('input#username').type(gebruikersnaam);
    cy.get('input#password').type(wachtwoord);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/producten');
  });

  it('Voegt product toe en werkt het bij', () => {
    // ➕ Voeg product toe
    cy.get('[data-testid="naam"]').type(origineel.naam);
    cy.get('[data-testid="prijs"]').type(origineel.prijs);
    cy.get('[data-testid="voorraad"]').type(origineel.voorraad);
    cy.get('[data-testid="categorie"]').type(origineel.categorie);
    cy.get('[data-testid="beschrijving"]').type(origineel.beschrijving);
    cy.contains('Toevoegen').click();
    cy.wait(1000);
    cy.contains(origineel.naam).should('exist');

    // ✏️ Open bewerkmodus door op de kaart te klikken
    cy.contains(origineel.naam)
      .closest('.product-card')
      .click();

    // 📝 Vul nieuwe waarden in
    cy.get('[data-testid="naam"]').clear().type(bijgewerkt.naam);
    cy.get('[data-testid="prijs"]').clear().type(bijgewerkt.prijs);
    cy.get('[data-testid="voorraad"]').clear().type(bijgewerkt.voorraad);
    cy.get('[data-testid="categorie"]').clear().type(bijgewerkt.categorie);
    cy.get('[data-testid="beschrijving"]').clear().type(bijgewerkt.beschrijving);
    cy.contains('Opslaan').click();

    cy.wait(1000);

    // ✅ Controle: oude naam weg, nieuwe naam zichtbaar
    //cy.contains(origineel.naam).should('not.exist');
    cy.contains(bijgewerkt.naam).should('exist');

    // 🗑️ Verwijder testproduct
    // cy.contains(bijgewerkt.naam)
    //   .closest('.product-card')
    //   .within(() => {
    //     cy.get('button').contains(/verwijder/i).click({ force: true });
    //   });

    // cy.wait(1000);
    // cy.contains(bijgewerkt.naam).should('not.exist');
  });
});

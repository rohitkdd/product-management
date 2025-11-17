describe('Product Management Integration Tests', () => {


  beforeEach(() => {
    cy.visit('/products');

    cy.get('.add-section', { timeout: 10000 }).should('be.visible');

    cy.get('[data-testid="input-name"]').clear();
    cy.get('[data-testid="input-price"]').clear();
  });

  // ------------------------------
  // Add Product
  // ------------------------------
  it('should add a new product', () => {
    const productName = 'Test Product 1';

    cy.get('[data-testid="input-name"]').type(productName);
    cy.get('[data-testid="input-price"]').type('100');
    cy.get('[data-testid="add-product-btn"]').click();

    // Wait for the new product card to appear
    cy.get('[data-testid^="product-card-"]')
      .contains(productName, { timeout: 10000 })
      .should('be.visible');
  });

  // ------------------------------
  // Edit Product
  // ------------------------------
  it('should edit an existing product', () => {
    const productName = 'Test Product 2';
    const updatedName = 'Updated Product 2';

    // Add a product first
    cy.get('[data-testid="input-name"]').type(productName);
    cy.get('[data-testid="input-price"]').type('120');
    cy.get('[data-testid="add-product-btn"]').click();

    // Find the product card
    cy.get('[data-testid^="product-card-"]')
      .contains(productName)
      .closest('[data-testid^="product-card-"]')
      .then($card => {
        const cardId = $card.attr('data-testid')?.replace('product-card-', '');
        if (!cardId) throw new Error('Product card id not found');

        // Click Edit
        cy.wrap($card).find('[data-testid="edit-btn"]').click();

        // Wait for the edit form to render
        cy.wrap($card).find(`[data-testid="editName-${cardId}"]`, { timeout: 10000 }).should('be.visible');

        // Fill in edit fields
        cy.wrap($card).find(`[data-testid="editName-${cardId}"]`).clear().type(updatedName);
        cy.wrap($card).find(`[data-testid="editPrice-${cardId}"]`).clear().type('150');

        // Submit edit
        cy.wrap($card).find(`[data-testid="submit-btn-${cardId}"]`).click();
      });

    // Verify updated product
    cy.get('[data-testid^="product-card-"]').contains(updatedName).should('exist');
  });

  // ------------------------------
  // Delete Product
  // ------------------------------
  it('should delete a product', () => {
    const productName = 'Test Product 3';

    // Add a product first
    cy.get('[data-testid="input-name"]').type(productName);
    cy.get('[data-testid="input-price"]').type('130');
    cy.get('[data-testid="add-product-btn"]').click();

    // Delete the product
    cy.get('[data-testid^="product-card-"]')
      .contains(productName)
      .closest('[data-testid^="product-card-"]')
      .within(() => {
        cy.get('[data-testid="delete-btn"]').click();
      });

    // Verify it is removed
    cy.get('[data-testid^="product-card-"]').contains(productName).should('not.exist');
  });

  // ------------------------------
  // Form Validation
  // ------------------------------
  it('should validate required fields in add product form', () => {
    cy.get('[data-testid="add-product-btn"]').click();

    // Check validation messages
    cy.contains('Product name is required').should('be.visible');
    cy.contains('Price cannot be less than 0').should('be.visible');
  });

  it('should validate price must be greater than 0', () => {
    cy.get('[data-testid="input-price"]').type('-10');
    cy.get('[data-testid="add-product-btn"]').click();
    cy.contains('Price cannot be less than 0').should('be.visible');
  });

});

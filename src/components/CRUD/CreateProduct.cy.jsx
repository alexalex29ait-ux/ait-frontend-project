import React from 'react';
import { mount } from 'cypress/react18';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CreateProduct from './CreateProduct';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';  // ✅ Named import with curly braces

const mockStore = configureStore([thunk]);  // ✅ Use thunk directly

describe('CreateProduct Component Tests', () => {
  let store;
  
  const mountComponent = () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <CreateProduct />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    store = mockStore({
      products: {
        loading: false,
        error: null,
        success: false
      }
    });
  });

  it('Test 1: Renders correctly', () => {
    mountComponent();
    cy.contains('Add New Product').should('be.visible');
  });

it('Test 2: Form submission works', () => {
  // ✅ Match the EXACT URL your component calls
  cy.intercept('POST', '**/products', {  // Wildcard use pannu
    statusCode: 201,
    body: { id: 1, message: 'Created' }
  }).as('createProduct');

  mountComponent();

  cy.get('input[name="name"]').type('Test Product');
  cy.get('input[name="price"]').type('999');
  cy.get('input[name="stock"]').type('10');
  cy.get('textarea[name="description"]').type('This is a test product description');
  
  cy.get('input[type="file"]').selectFile({
    contents: Cypress.Buffer.from('fake image'),
    fileName: 'image1.jpg',
    mimeType: 'image/jpeg',
  }, { force: true });
  
  cy.contains('1 / 5 Images Selected').should('be.visible');
  cy.contains('Create Product').should('not.be.disabled').click();
  
  // ✅ Wait for the correct URL
  cy.wait('@createProduct').then((interception) => {
    console.log('✅ API Called:', interception.request.url);
    expect(interception.response.statusCode).to.eq(201);
  });
});
  it('Test 3: Validation works', () => {
    mountComponent();
    cy.contains('Create Product').should('be.disabled');
    
    cy.get('input[name="name"]').type('Test');
    cy.contains('Create Product').should('be.disabled');
    
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake'),
      fileName: 'test.jpg',
      mimeType: 'image/jpeg'
    }, { force: true });
    
    cy.contains('Create Product').should('not.be.disabled');
  });

  it('Test 4: Reset works', () => {
    mountComponent();
    
    cy.get('input[name="name"]').type('Test');
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake'),
      fileName: 'test.jpg',
      mimeType: 'image/jpeg'
    }, { force: true });
    
    cy.contains('1 / 5 Images Selected').should('be.visible');
    cy.contains('Reset All').click();
    cy.get('input[name="name"]').should('have.value', '');
    cy.contains('Choose Images').should('be.visible');
  });
});
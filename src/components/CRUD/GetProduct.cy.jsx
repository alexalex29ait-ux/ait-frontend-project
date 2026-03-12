import React from 'react';
import { mount } from 'cypress/react18';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import GetProduct from './GetProduct';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('GetProduct Component Tests', () => {
  let store;
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 13',
      price: 79999,
      description: 'Latest iPhone',
      stock: 50,
      images: ['iphone.jpg'],
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Samsung S23',
      price: 89999,
      description: 'Android flagship',
      stock: 30,
      images: ['samsung.jpg'],
      createdAt: '2024-01-02T10:00:00Z'
    }
  ];

  const mountComponent = () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <GetProduct />
        </BrowserRouter>
      </Provider>
    );
  };

  const waitForRender = () => {
    cy.contains('Products List', { timeout: 10000 }).should('be.visible');
  };

  it('Test 1: Products list display', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: mockProducts
    }).as('fetchProducts');

    store = mockStore({
      products: {
        products: mockProducts,
        filteredProducts: mockProducts,
        loading: false,
        error: null,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    waitForRender();
    cy.contains('iPhone 13').should('be.visible');
    cy.contains('Samsung S23').should('be.visible');
  });

  it('Test 2: Product count correct', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: mockProducts
    }).as('fetchProducts');

    store = mockStore({
      products: {
        products: mockProducts,
        filteredProducts: mockProducts,
        loading: false,
        error: null,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    cy.contains('Found 2 products').should('be.visible');
  });

  it('Test 3: Filter button works', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: mockProducts
    }).as('fetchProducts');

    store = mockStore({
      products: {
        products: mockProducts,
        filteredProducts: mockProducts,
        loading: false,
        error: null,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    cy.contains('Filters').click();
    cy.get('input[type="text"]').first().should('be.visible');
  });

  it('Test 4: Search filter works', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: mockProducts
    }).as('fetchProducts');

    const filteredProducts = [mockProducts[0]];

    store = mockStore({
      products: {
        products: mockProducts,
        filteredProducts: filteredProducts,
        loading: false,
        error: null,
        filters: { name: 'iPhone' },
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    cy.contains('iPhone 13').should('be.visible');
    cy.contains('Samsung S23').should('not.exist');
  });

  it('Test 5: Delete button works', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: mockProducts
    }).as('fetchProducts');

    cy.intercept('DELETE', '**/products/1', {
      statusCode: 200,
      body: { message: 'Deleted successfully' }
    }).as('deleteProduct');

    store = mockStore({
      products: {
        products: mockProducts,
        filteredProducts: mockProducts,
        loading: false,
        error: null,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    cy.contains('Delete').first().click();
    cy.wait('@deleteProduct', { timeout: 10000 });
  });

it('Test 6: Loading state', () => {
  // Block API completely
  cy.intercept('GET', '**/products', (req) => {
    console.log('🔍 API intercepted but blocked');
    // Never reply
  }).as('loadingRequest');

  store = mockStore({
    products: {
      products: [],                    // Empty array
      filteredProducts: [],
      loading: true,                   // Loading true
      error: null,
      filters: {},
      sort: { field: 'createdAt', order: 'desc' }
    }
  });

  mountComponent();
  
  // ✅ DEBUG: Print entire DOM
  cy.document().then(doc => {
    console.log('📄 FULL DOM when loading should show:');
    console.log(doc.body.innerHTML);
    
    // Check what's actually rendering
    if (doc.body.innerHTML.includes('iPhone')) {
      console.log('❌ Products are rendering instead of loader!');
    }
    if (doc.body.innerHTML.includes('Products List')) {
      console.log('❌ Products List is rendering instead of loader!');
    }
  });
  
  // Wait a bit for render
  cy.wait(1000);
  
  // ✅ Try multiple selectors
  cy.get('body').then($body => {
    console.log('📄 Body content:', $body.text());
    
    // Check for ANY loading indicator
    const loaderSelectors = [
      '.MuiCircularProgress-root',
      '[class*="progress"]',
      '[class*="loader"]',
      '[class*="spinner"]',
      '[class*="spin"]',
      'div:contains("Loading")',
      'svg',
      '.w-20',
      '.h-20',
      '.animate-spin',
      '.border-pink-500'
    ];
    
    let found = false;
    loaderSelectors.forEach(selector => {
      if ($body.find(selector).length > 0) {
        console.log(`✅ Found loader with selector: ${selector}`);
        cy.get(selector).first().should('be.visible');
        found = true;
      }
    });
    
    if (!found) {
      console.log(' No loader found! Page content:');
      console.log($body.html());
      throw new Error('Loader not found');
    }
  });
});

  it('Test 7: Empty state', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 200,
      body: []
    }).as('fetchProducts');

    store = mockStore({
      products: {
        products: [],
        filteredProducts: [],
        loading: false,
        error: null,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
      }
    });

    mountComponent();
    cy.wait('@fetchProducts', { timeout: 10000 });
    cy.contains('No products found', { timeout: 10000 }).should('be.visible');
  });

it('Test 8: DEBUG - See what renders', () => {
  // Don't intercept - just set store
  store = mockStore({
    products: {
      products: [],
      filteredProducts: [],
      loading: false,
      error: 'Failed to fetch products',
      filters: {},
      sort: { field: 'createdAt', order: 'desc' }
    }
  });

  mountComponent();
  
  // Wait for render
  cy.wait(2000);
  
  // Print everything
  cy.document().then(doc => {
    console.log('========== FULL DOM ==========');
    console.log(doc.body.innerHTML);
    console.log('==============================');
    
    // Check what's actually there
    if (doc.body.innerHTML.includes('Failed to fetch products')) {
      console.log('✅ Error text found in DOM');
    } else {
      console.log('❌ Error text NOT found');
      
      // What IS rendering?
      console.log('Rendered text:', doc.body.textContent);
      
      // Check if loader is showing
      if (doc.body.innerHTML.includes('progress') || doc.body.innerHTML.includes('loader')) {
        console.log('⚠️ Loader is showing instead of error');
      }
      
      // Check if empty state is showing
      if (doc.body.innerHTML.includes('No products found')) {
        console.log('⚠️ Empty state is showing instead of error');
      }
      
      // Check if products are showing
      if (doc.body.innerHTML.includes('iPhone') || doc.body.innerHTML.includes('Samsung')) {
        console.log('⚠️ Products are showing instead of error');
      }
    }
  });
});
});
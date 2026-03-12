// Create file: cypress/support/component.js
import { mount } from 'cypress/react18';

// Add this to make mount available globally
Cypress.Commands.add('mount', mount);
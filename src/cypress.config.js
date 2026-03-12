// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    // ✅ Add this line - critical for React 18+
    experimentalSingleTabRunMode: false,
    specPattern: "src/**/*.cy.{js,jsx}",
     supportFile: "cypress/support/component.js",
  },
  
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx}",
    supportFile: false,
  },
});
import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";

import UpdateProduct from "./UpdateProduct";

const mockStore = configureStore([thunk]);

describe("UpdateProduct Component Tests", () => {

let store;

const mockProduct = {
  _id: "123",
  name: "Test Product",
  price: 999,
  description: "Test Description",
  stock: 10,
  images: ["test-image.jpg"],
  createdAt: "2024-01-01T10:00:00Z"
};

const mountComponent = () => {

mount(
  <Provider store={store}>
    <MemoryRouter initialEntries={["/updateproduct/123"]}>
      <Routes>
        <Route path="/updateproduct/:id" element={<UpdateProduct />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

};

beforeEach(() => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: null,
    loading: false,
    error: null,
    success: false
  }
});

});

it("Test 1: Component renders with product data", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: mockProduct,
    loading: false,
    error: null,
    success: false
  }
});

mountComponent();

cy.contains("Edit Product").should("be.visible");

cy.get('input[name="name"]').should("have.value", "Test Product");
cy.get('input[name="price"]').should("have.value", "999");
cy.get('input[name="stock"]').should("have.value", "10");
cy.get('textarea[name="description"]').should("have.value", "Test Description");

});

it("Test 2: Current image display", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: mockProduct,
    loading: false,
    error: null,
    success: false
  }
});

mountComponent();

cy.contains("Current Images:").should("be.visible");

cy.get('img[alt^="Current"]').should("be.visible");

});

it("Test 3: Update form submission", () => {

cy.intercept("PUT", "**/products/123", {
  statusCode: 200,
  body: { message: "Updated successfully" }
}).as("updateProduct");

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: mockProduct,
    loading: false,
    error: null,
    success: false
  }
});

mountComponent();

cy.get('input[name="name"]').clear().type("Updated Product");
cy.get('input[name="price"]').clear().type("1999");

cy.contains("Update").click();

});

it("Test 4: Cancel button works", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: mockProduct,
    loading: false,
    error: null,
    success: false
  }
});

mountComponent();

cy.contains("Cancel").click();

});

it("Test 5: Loading state", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: null,
    loading: true,
    error: null,
    success: false
  }
});

mountComponent();

cy.contains("Loading product details...").should("be.visible");

});

it("Test 6: Error state", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: null,
    loading: false,
    error: "Failed to load product",
    success: false
  }
});

mountComponent();

cy.contains("Failed to load product").should("be.visible");

});

it("Test 7: Success state", () => {

store = mockStore({
  products: {
    products: [],
    filteredProducts: [],
    product: mockProduct,
    loading: false,
    error: null,
    success: true
  }
});

mountComponent();

cy.get(".MuiAlert-root")
.should("be.visible")
.and("contain.text", "Product updated successfully");

});

});
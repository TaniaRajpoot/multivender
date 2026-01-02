import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  products: [],  
  isLoading: false,
  error: null,
  product: null,
  success: false,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    // Create product
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // Get all products of a shop
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllProductsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete product
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    }
    )
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.products = state.products.filter(
        (product) => product._id !== action.payload._id
      );
    }
    )
    .addCase("deleteProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    

    // Clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
      state.success = false;
    });
});
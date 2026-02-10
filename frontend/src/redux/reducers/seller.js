import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const SellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.isSeller = true;
      state.seller = action.payload;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    })
    .addCase("sellerLogout", (state) => {
      state.isSeller = false;
      state.seller = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    })
    // Get all sellers - Admin
    .addCase("getAllSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
    })
    .addCase("getAllSellerFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});

export default SellerReducer;
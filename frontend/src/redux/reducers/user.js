import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder

  //load user
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
   .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    
    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessages", (state) => {
  state.successMessage = null;
})
    .addCase("LogoutSuccess", (state) => {
      state.isAuthenticated = false;
      state.user = null;
    })
    .addCase("LogoutFail", (state, action) => {
      state.error = action.payload;
    })
    // update user info
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
      state.updateSuccess = false; 
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.updateSuccess = true;
    })
    .addCase("updateUserInfoFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false; 
    })
    .addCase("clearUpdateSuccess", (state) => {
      state.updateSuccess = false;
    })
    // update user address
    .addCase("updateUserAddressRequest", (state) => {
      state.addressloading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("updateUserAddressFailure", (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })
    // delete user address
    .addCase("deleteUserAddressRequest", (state) => {
      state.addressloading = true;
    })
    .addCase("deleteUserAddressSuccess", (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("deleteUserAddressFailure", (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    })
     //get all User --->ADMIN
    .addCase("getAllUsersRequest", (state) => {
      state.Userloading = true;
    })
    .addCase("getAllUsersSuccess", (state, action) => {
      state.Userloading = false;
      state.users = action.payload;
    })
    .addCase("getAllUsersFail", (state, action) => {
      state.Userloading = false;
      state.error = action.payload;
    })

});

export default userReducer;
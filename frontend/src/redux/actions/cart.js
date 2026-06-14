// Add To Cart Action (using Redux Thunk)
export const addToCart = (item) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: item,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart)); //reducer.cart
  return item;
};
//  Remove From Cart Action
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart)); ////reducer.cart
  return data;
};
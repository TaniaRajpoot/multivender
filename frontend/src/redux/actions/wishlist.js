// Add To WishList Action (using Redux Thunk)
export const addToWishList = (item) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishList",
    payload: item,
  });
  localStorage.setItem(
    "wishListItems",
    JSON.stringify(getState().wishlist.wishlist) //reducer.wishlist
  );
  return item;
};
//  Remove From WishList Action
export const removeFromWishList = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromWishList",
    payload: data._id,
  });
  localStorage.setItem(
    "wishListItems",
    JSON.stringify(getState().wishlist.wishlist) //reducer.wishlist
  );
  return data;
};
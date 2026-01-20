import {configureStore, } from "@reduxjs/toolkit";
import {userReducer} from "./reducers/user"
import {SellerReducer} from"./reducers/seller"
import {productReducer} from"./reducers/product"
import {eventReducer} from"./reducers/event"
import {cartReducer} from"./reducers/cart"
import {wishlistReducer} from"./reducers/wishlist"

const Store = configureStore({
    reducer:{
        user:userReducer,
        seller:SellerReducer,
        product:productReducer,
        events:eventReducer,
        cart:cartReducer,
        wishlist:cartReducer,

        
    }
});

export default Store;


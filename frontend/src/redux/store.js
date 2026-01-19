import {configureStore, } from "@reduxjs/toolkit";
import {userReducer} from "./reducers/user"
import {SellerReducer} from"./reducers/seller"
import {productReducer} from"./reducers/product"
import {eventReducer} from"./reducers/event"
import {cartReducer} from"./reducers/cart"

const Store = configureStore({
    reducer:{
        user:userReducer,
        seller:SellerReducer,
        product:productReducer,
        events:eventReducer,
        cart:cartReducer,
        
    }
});

export default Store;


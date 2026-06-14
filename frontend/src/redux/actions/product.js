import axios from "axios";
import { server } from "../../server";

//create product 
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: "productCreateRequest" });
        
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };
        
        const { data } = await axios.post(
            `${server}/product/create-product`,
            productData,
            config
        );
        
        dispatch({
            type: "productCreateSuccess",
            payload: data.product,
        });
    } catch (error) {
        dispatch({
            type: "productCreateFail",
            payload: error.response?.data?.message || "Failed to create product",
        });
    }
};

//get all products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
    try {
        dispatch({ type: "getAllProductsShopRequest" });
        
        console.log('Fetching products for shop:', id);
        
        const { data } = await axios.get(
            `${server}/product/get-all-products-shop/${id}`,
            { withCredentials: true }
        );
        
        console.log('Products received:', data);
        
        dispatch({
            type: "getAllProductsShopSuccess",
            payload: data.products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        dispatch({
            type: "getAllProductsShopFail",
            payload: error.response?.data?.message || "Failed to fetch products",
        });
    }
};

//delete product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: "deleteProductRequest" });
        
        const { data } = await axios.delete(
            `${server}/product/delete-shop-product/${id}`,
            { withCredentials: true }
        );
        
        dispatch({
            type: "deleteProductSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteProductFail",
            payload: error.response?.data?.message || "Failed to delete product",
        });
    }
};

//get all products
export const getAllProducts = () => async (dispatch) => {
    try {
        dispatch({ type: "getAllProductsRequest" });
        
        const { data } = await axios.get(`${server}/product/get-all-products`);
        
        dispatch({
            type: "getAllProductsSuccess",
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: "getAllProductsFailed",
            payload: error.response?.data?.message || "Failed to fetch products",
        });
    }
};

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: "clearErrors" });
};
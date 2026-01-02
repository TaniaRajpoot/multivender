import axios from 'axios';
import { server } from '../../server';
//loading seller
export const loadSeller = ( ) =>async(dispatch) =>{
    try {
        dispatch({
            type:"LoadSellerRequest"
        });
        const {data} = await axios.get(`${server}/shop/getSeller`,{withCredentials:true});
        console.log(data);
        dispatch({
            type:"LoadSellerSuccess",
            payload: data.seller,
        });
    } catch (error) {
        console.error('LoadSeller error:', error);
        dispatch({
            type:"LoadSellerFail",
            payload: error?.response?.data?.message || error?.message || "Something went wrong"
        })
    }
}
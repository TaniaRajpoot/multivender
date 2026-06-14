
import axios from 'axios';
import { server } from '../../server';

export const loadSeller = ( ) =>async(dispatch) =>{
    try {
        dispatch({
            type:"LoadSellerRequest"
        });
        const {data} = await axios.get(`${server}/shop/getSeller`,{withCredentials:true});
        console.log(data);
        dispatch({
            type:"LoadSellerSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type:"LoadSellerFail",
            payload:error.response.data.message
        })
    }
}


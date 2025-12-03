import axios from 'axios';
import { server } from '../../server';

//loading user 
export const loadUser = ( ) =>async(dispatch) =>{
    try {
        dispatch({
            type:"LoadUserRequest"
        });
        const {data} = await axios.get(`${server}/user/getuser`,{withCredentials:true});
        console.log(data);
        dispatch({
            type:"LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type:"LoadUserFail",
            payload:error.response.data.message
        })
    }
}

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
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type:"LoadSellerFail",
            payload:error.response.data.message
        })
    }
}


import axios from "axios";
import { server } from "../../server";

//create-event
export const createEvent = (data) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    const response = await axios.post(
      `${server}/event/create-event`,
      data,
      { withCredentials: true }
    );

    dispatch({
      type: "eventCreateSuccess",
      payload: response.data.event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

//getAllEventsShop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsShopRequest" });
    const response = await axios.get(
      `${server}/event/get-all-events/${id}`,
      { withCredentials: true }
    );
    
    console.log("API Response:", response.data); // Debug log
    
    dispatch({
      type: "getAllEventsShopSuccess",
      payload: response.data.events, // ✅ FIXED - changed from products to events
    });
  }
  catch (error) {
    dispatch({
      type: "getAllEventsShopFail",
      payload: error.response?.data?.message || error.message,
    });
  }   
};

//deleteEvent
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEventRequest" }); 
    const response = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      { withCredentials: true }
    );

    dispatch({  
      type: "deleteEventSuccess",
      payload: response.data.message,
    });
  }
  catch (error) {
    dispatch({
      type: "deleteEventFail",  
      payload: error.response?.data?.message || error.message,
    });
  } 
};
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice";
import campaignReducer from "../Slices/campaignSlice";
import profileReducer from "../Slices/profileSlice";
import paymentReducer from "../Slices/paymentSlice";
import cartReducer from "../Slices/cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  campaign: campaignReducer,
  profile: profileReducer,
  payment: paymentReducer,
  cart: cartReducer,
});

export default rootReducer;

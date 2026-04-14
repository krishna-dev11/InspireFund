import showToast from "../../Utilities/showToast";
import { setLoading, setLastPayment } from "../../Slices/paymentSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { INITIATE_PAYMENT_API, VERIFY_PAYMENT_API } = endpoints;

export function initiatePayment(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await apiConnector("POST", INITIATE_PAYMENT_API, payload);
      dispatch(setLastPayment(data));
      return data;
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to initiate payment", "error");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function verifyPayment(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await apiConnector("POST", VERIFY_PAYMENT_API, payload);
      dispatch(setLastPayment(data));
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Payment verification failed. Contact support.", "error");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

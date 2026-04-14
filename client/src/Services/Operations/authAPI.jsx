import { setLoading, setToken, setUser, setAuthChecked } from "../../Slices/authSlice";
import { resetCampaign } from "../../Slices/campaignSlice";
import { resetProfile } from "../../Slices/profileSlice";
import { resetPayment } from "../../Slices/paymentSlice";
import { resetCart } from "../../Slices/cartSlice";
import { apiConnector, setAuthToken } from "../apiConnector";
import { endpoints } from "../apis";
import showToast from "../../Utilities/showToast";

const { LOGIN_API, SIGNUP_API, GOOGLE_LOGIN_API } = endpoints;

export function initializeAuth() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem("fi_token");
      const saved = localStorage.getItem("fi_user");
      if (token && saved) {
        setAuthToken(token);
        dispatch(setToken(token));
        dispatch(setUser(JSON.parse(saved)));
      }
    } catch {
      localStorage.removeItem("fi_token");
      localStorage.removeItem("fi_user");
      setAuthToken(null);
      dispatch(setToken(null));
      dispatch(setUser(null));
    } finally {
      dispatch(setAuthChecked(true));
      dispatch(setLoading(false));
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password });

      if (!response.data?.token) {
        throw new Error(response.data?.message || "Login failed");
      }

      const { user, token } = response.data;
      showToast(`Welcome back, ${user.name}!`, "success");

      dispatch(setToken(token));
      dispatch(setUser(user));
      localStorage.setItem("fi_token", token);
      localStorage.setItem("fi_user", JSON.stringify(user));
      setAuthToken(token);

      if (navigate) navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Authentication failed", "error");
    }

    dispatch(setLoading(false));
  };
}

export function signup(payload, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, payload);

      if (!response.data?.token) {
        throw new Error(response.data?.message || "Signup failed");
      }

      const { user, token } = response.data;
      showToast(`Welcome, ${user.name}!`, "success");

      dispatch(setToken(token));
      dispatch(setUser(user));
      localStorage.setItem("fi_token", token);
      localStorage.setItem("fi_user", JSON.stringify(user));
      setAuthToken(token);

      if (navigate) navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Authentication failed", "error");
    }

    dispatch(setLoading(false));
  };
}

export function googleLogin(payload, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", GOOGLE_LOGIN_API, payload);

      if (!response.data?.token) {
        throw new Error(response.data?.message || "Google login failed");
      }

      const { user, token } = response.data;
      showToast(`Welcome${user?.name ? `, ${user.name}` : ""}!`, "success");

      dispatch(setToken(token));
      dispatch(setUser(user));
      localStorage.setItem("fi_token", token);
      localStorage.setItem("fi_user", JSON.stringify(user));
      setAuthToken(token);

      if (navigate) navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Authentication failed", "error");
    }

    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCampaign());
    dispatch(resetProfile());
    dispatch(resetPayment());
    dispatch(resetCart());
    localStorage.removeItem("fi_token");
    localStorage.removeItem("fi_user");
    setAuthToken(null);
    if (navigate) navigate("/login");
  };
}

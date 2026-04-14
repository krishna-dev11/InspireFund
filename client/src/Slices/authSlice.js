import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("fi_token") ? localStorage.getItem("fi_token") : null,
  loading: false,
  user: localStorage.getItem("fi_user")
    ? JSON.parse(localStorage.getItem("fi_user"))
    : null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setAuthChecked(state, action) {
      state.authChecked = action.payload;
    },
  },
});

export const { setToken, setLoading, setUser, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;

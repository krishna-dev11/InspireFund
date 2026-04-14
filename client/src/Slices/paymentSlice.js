import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  lastPayment: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLastPayment(state, action) {
      state.lastPayment = action.payload;
    },
    resetPayment(state) {
      state.lastPayment = null;
    },
  },
});

export const { setLoading, setLastPayment, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

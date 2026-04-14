import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    resetCart(state) {
      state.items = [];
    },
  },
});

export const { setItems, resetCart } = cartSlice.actions;
export default cartSlice.reducer;

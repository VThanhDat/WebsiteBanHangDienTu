import { createSlice } from "@reduxjs/toolkit";
import { getNewProducts } from "./asyncThunk";
export const productSlice = createSlice({
  name: "product",
  initialState: {
    newProducts: null,
    isLoading: false,
    errorMessage: "",
  },
  extraReducers: (builder) => {
    builder.addCase(getNewProducts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProducts = action.payload;
      console.log(action.payload);
    });

    builder.addCase(getNewProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

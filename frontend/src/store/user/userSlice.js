import { createSlice } from "@reduxjs/toolkit";
import { getCurrent, refreshToken } from "./asyncThunk";

export const userSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: true,
    isLoggedIn: false,
    isRefreshingToken: false,
    current: null,
    token: null,
    errorMessage: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.current = action.payload.userData;
      state.token = action.payload.token;
    },
    setIsRefreshingToken: (state, action) => {
      state.isRefreshingToken = action.payload;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.current = null;
      state.token = null;
    },
    editOrder: (state, action) => {
      state.current = { ...state.current, cart: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrent.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getCurrent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
    });

    builder.addCase(getCurrent.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload?.newAccessToken;
    });

    builder.addCase(refreshToken.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload?.message;
    });
  },
});

// Export individual actions
export const { login, setIsRefreshingToken, logout, editOrder } =
  userSlice.actions;

// Export the slice reducer
export default userSlice.reducer;

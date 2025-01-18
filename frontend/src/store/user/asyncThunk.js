import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";
import { userSlice } from "./userSlice";

export const getCurrent = createAsyncThunk(
  "auth/current",
  async (token, { rejectWithValue }) => {
    const response = await apis.apiGetCurrent(token);
    if (!response.success) return rejectWithValue(response);
    return response.result;
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshtoken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(userSlice.actions.setIsRefreshingToken(true));

      const response = await apis.apiRefreshToken();

      if (!response.success) return rejectWithValue(response);
      return response;
    } finally {
      dispatch(userSlice.actions.setIsRefreshingToken(false));
    }
  },
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getCategories = createAsyncThunk(
  // action name
  "app/categories",

  // Code async logic, tham số đầu tiên data là dữ liệu truyền vào khi gọi action
  async (data, { rejectWithValue }) => {
    // Gọi lên API backend
    const response = await apis.apiGetCategories();
    if (!response.success) return rejectWithValue(response);
    return response;
  },
);

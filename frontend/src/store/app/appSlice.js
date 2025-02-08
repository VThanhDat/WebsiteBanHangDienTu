import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./asyncThunk";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
    isIconCardClick: false,
    isShowCart: false,
    isShowModal: false,
    modalChildren: null,
  },
  // Các action bình thường (sync action)
  reducers: {
    toggleCart: (state) => {
      state.isShowCart = !state.isShowCart;
    },
    setisIconCartClickTrue: (state) => {
      state.isIconCardClick = true;
    },
    setisIconCartClickFalse: (state) => {
      state.isIconCardClick = false;
    },
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalChildren = action.payload.modalChildren;
    },
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action
    builder.addCase(getCategories.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action thành công
    builder.addCase(getCategories.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin categories vào state
      state.isLoading = false;
      state.categories = action.payload.prodCategories;
    });

    // Khi thực hiện action thất bại
    builder.addCase(getCategories.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin lỗi vào state
      state.isLoading = false;
      state.errorMessage = action.payload?.message;
    });
  },
});

export const { showModal } = appSlice.actions;

// Export the slice reducer
export default appSlice.reducer;

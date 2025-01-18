import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./app/appSlice";
import { productSlice } from "./product/productSlice";
import { userSlice } from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const commonConfig = {
  key: "shop/user",
  storage,
};

const userConfig = {
  ...commonConfig,
  whitelist: ["isLoggedIn", "token"],
};

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    products: productSlice.reducer,
    user: persistReducer(userConfig, userSlice.reducer),
  },
});

export const persistor = persistStore(store);

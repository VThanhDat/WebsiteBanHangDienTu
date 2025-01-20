import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  DetailProduct,
  FAQs,
  Products,
  Services,
  Blogs,
  AuthRegister,
  ResetPassword,
  WishList,
  Cart,
} from "./pages/public";
import path from "./utils/path";
import { getCategories } from "./store/app/asyncThunk";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "./pages/public/Checkout";

function App() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.app.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.FAQs} element={<FAQs />} />
          <Route
            path={`/${path.DETAIL_PRODUCT__SLUG}`}
            element={<DetailProduct />}
          />
          <Route path={path.PRODUCTS} element={<Products />}></Route>
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.WISHLIST} element={<WishList />} />
          <Route path={path.CART} element={<Cart />} />
          <Route path={`/${path.CHECKOUT}`} element={<Checkout />} />
        </Route>
        <Route path={path.AUTH_REGISTER} element={<AuthRegister />} />
        <Route path={`/${path.LOGIN}`} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

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
import { Modal } from "./components";

function App() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.app.categories);
  const { isShowModal, modalChildren } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <div className="relative font-main">
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        {/* CLIENT */}
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.FAQs} element={<FAQs />} />
          <Route
            path={`/${path.DETAIL_PRODUCT__SLUG}`}
            element={<DetailProduct />}
          />
          <Route path={path.PRODUCTS} element={<Products />}>
            {categories?.map((cate, index) => (
              <Route
                key={index}
                path={`/${path.PRODUCTS}/${cate.title}`}
                element={<Products />}
              />
            ))}
          </Route>
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.WISHLIST} element={<WishList />} />
          <Route path={path.CART} element={<Cart />} />
          <Route path={`/${path.CHECKOUT}`} element={<Checkout />} />
        </Route>
        <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={path.AUTH_REGISTER} element={<AuthRegister />} />
        <Route path={`/${path.LOGIN}`} element={<Login />} />

        {/* ADMIN */}
      </Routes>
    </div>
  );
}

export default App;

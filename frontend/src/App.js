import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Home, Public } from "./pages/public";
import path from "./utils/path";
import { getCategories } from "./store/app/asyncThunk";
import { useDispatch, useSelector } from "react-redux";

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
          <Route path={path.LOGIN} element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

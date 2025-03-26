import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Header, Navigation, TopHeader, Footer } from "../../components";
import MoveTopButton from "../../components/footer/MoveTopButton";

const Public = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex w-full flex-col items-center">
      <TopHeader />
      <Header />
      <Navigation />
      <div className="w-full max-w-main max-xl:px-3">
        <BreadCrumb pathname={pathname} />
        <div className="mt-6 w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
      <MoveTopButton />
    </div>
  );
};

export default Public;

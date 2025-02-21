import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import path from "../../utils/path";
import { Header, Sidebar } from "./components";

const Admin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isHideSideBar, setIsHideSideBar] = useState(true);

  useEffect(() => {
    if (pathname === `/${path.ADMIN}`) navigate(`/${path.DASHBOARD}`);
  }, []);
  return (
    <div className="flex h-screen w-screen flex-grow-0 overflow-y-hidden">
      {isHideSideBar && <Sidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          isHideSideBar={isHideSideBar}
          setIsHideSideBar={setIsHideSideBar}
        />
        <div className="w-[calc(100vw -300px)] h-[calc(100vh-76px)] flex-grow-0 overflow-x-hidden overflow-y-scroll bg-[#F1F5F9] p-7">
          <BreadCrumb pathname={pathname} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

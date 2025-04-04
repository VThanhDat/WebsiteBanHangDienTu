import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import path from "../../utils/path";
import { Header, Sidebar } from "./components";

const Admin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isHideSideBar, setIsHideSideBar] = useState(true);

  const cleanPathname = pathname.replace(/\/[0-9a-fA-F]{24}$/, ""); // Xóa ObjectId 24 ký tự

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
          <BreadCrumb pathname={cleanPathname} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

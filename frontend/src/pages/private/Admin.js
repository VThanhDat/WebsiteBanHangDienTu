// Admin.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb";
import path from "../../utils/path";
import { Header, Sidebar } from "./components";

const Admin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if screen is mobile on load and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
        setShowSidebar(true); // Always show sidebar on larger screens
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cleanPathname = pathname.replace(/\/[0-9a-fA-F]{24}$/, ""); // Remove 24-char ObjectId

  useEffect(() => {
    if (pathname === `/${path.ADMIN}`) navigate(`/${path.DASHBOARD}`);

    // We're removing the auto-hide sidebar when navigating to keep it visible
    // even when a menu item is selected
  }, [pathname, navigate]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen w-screen flex-grow-0 overflow-y-hidden">
      {showSidebar && <Sidebar isCollapsed={isSidebarCollapsed} />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
        <div className="h-[calc(100vh-76px)] flex-grow-0 overflow-x-hidden overflow-y-scroll bg-[#F1F5F9] p-4 md:p-7">
          <BreadCrumb pathname={cleanPathname} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

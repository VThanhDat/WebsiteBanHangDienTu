import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import icons from "../../../utils/icons";
import path from "../../../utils/path";

const {
  RxDashboard,
  RiProductHuntLine,
  AiOutlineShoppingCart,
  HiOutlineClipboardDocumentCheck,
  AiOutlineStar,
  RiCoupon2Line,
  SiBrandfolder,
  RxAvatar,
} = icons;
const sidebarItem = [
  { icon: <RxDashboard />, title: "Dasboard", path: `/${path.DASHBOARD}` },
  {
    icon: <SiBrandfolder />,
    title: "Brands",
    path: `/${path.BRANDS}`,
  },

  {
    icon: <AiOutlineShoppingCart />,
    title: "Categories",
    path: `/${path.CATEGOGIES}`,
  },
  {
    icon: <RiProductHuntLine />,
    title: "Products",
    path: `/${path.PRODUCTS_ADMIN}`,
  },
  { icon: <AiOutlineStar />, title: "Ratings", path: `/${path.RATINGS}` },
  { icon: <RiCoupon2Line />, title: "Coupons", path: `/${path.ADMIN_COUPONS}` },
  {
    icon: <RxAvatar />,
    title: "Users",
    path: `/${path.USERS}`,
  },
  {
    icon: <HiOutlineClipboardDocumentCheck />,
    title: "Orders",
    path: `/${path.ORDERS}`,
  },
];

const Sidebar = () => {
  return (
    <div className="w-[300px] flex-shrink-0 border-r">
      <Link to="/" className="flex h-[76px] border-b p-5">
        <img src={logo} alt="" className="w-full object-contain" />
      </Link>
      <div className="p-5">
        {sidebarItem?.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              isActive
                ? "mb-2 flex h-[44px] items-center rounded-md font-medium text-main hover:cursor-pointer hover:bg-gray-200"
                : "mb-2 flex h-[44px] items-center rounded-md font-medium hover:cursor-pointer hover:bg-gray-200"
            }
          >
            <span className="pr-2">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

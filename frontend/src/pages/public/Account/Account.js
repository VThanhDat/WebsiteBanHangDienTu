import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../utils/icons";
import path from "../../../utils/path";

const { AiOutlineShoppingCart, AiOutlineUser } = icons;

const sidebar = [
  {
    icon: <AiOutlineUser size={22} className="text-blue-600" />,
    title: "MY ACCOUNT",
    path: `/${path.ACCOUNT_PROFILE}`,
    subItems: [
      { title: "PROFILE", path: `/${path.ACCOUNT_PROFILE}` },
      { title: "ADDRESS", path: `/${path.ACCOUNT_ADDRESS}` },
      { title: "CHANGE PASSWORD", path: `/${path.ACCOUNT_PASSWORD}` },
    ],
  },
  {
    icon: <AiOutlineShoppingCart size={22} className="text-gray-600" />,
    title: "ORDERS",
    path: `/${path.ACCOUNT_ORDERS}`,
  },
];

const Account = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === `/${path.ACCOUNT}`)
      navigate(`/${path.ACCOUNT}/${state || "profile"}`);
  }, [state, pathname, navigate]);

  return (
    <div className="mb-10 flex max-md:flex-col">
      {/* Sidebar */}
      <div className="flex-2 border">
        <div className="flex h-[48px] items-center justify-center bg-main text-xl font-semibold text-white">
          CATEGORY
        </div>
        <div className="p-4 text-lg font-medium text-gray-700 max-md:flex max-md:gap-4">
          {sidebar.map((item) => (
            <div key={item.title} className="mb-4">
              <NavLink
                to={item.path || "#"}
                className={({ isActive }) => {
                  // Kiểm tra nếu pathname chứa bất kỳ subItem nào thì MY ACCOUNT cũng active
                  const isParentActive = item.subItems?.some((sub) =>
                    pathname.includes(sub.path),
                  );

                  return `flex items-center gap-3 rounded-md p-2 text-lg font-semibold transition-all duration-200 ${
                    isActive || isParentActive
                      ? "bg-gray-100 text-main"
                      : "text-gray-800 hover:bg-gray-100"
                  }`;
                }}
              >
                {item.icon}
                {item.title}
              </NavLink>

              {item.subItems && (
                <div className="ml-8 mt-2 flex flex-col gap-2 text-gray-600">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.title}
                      to={sub.path}
                      className={({ isActive }) =>
                        `rounded-md p-1 px-3 text-base transition-all duration-200 ${
                          isActive
                            ? "bg-gray-100 font-semibold text-main"
                            : "hover:bg-gray-100 hover:text-main"
                        }`
                      }
                    >
                      {sub.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-5 border border-l-0 pl-5 pr-[72px] text-gray-700 max-md:border-l max-md:border-t-0 max-md:pr-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;

import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";
import path from "../../utils/path";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const { TfiMenu } = icons;

const Sidebar = () => {
  const { categories } = useSelector((state) => state.app);

  return (
    <div className="flex h-full max-h-[438px] flex-col border max-md:hidden">
      <div className="flex items-center bg-main px-5 py-[10px] text-[16px] font-semibold text-white">
        <span className="mr-3 flex items-center justify-center">
          <TfiMenu size={18} />
        </span>
        <span>ALL COLECTIONS</span>
      </div>
      <div className="flex flex-col overflow-y-scroll">
        {categories ? (
          categories?.map((item) => (
            <NavLink
              key={item.title}
              to={`/${path.PRODUCTS}/${item.title.toLowerCase()}`}
              className={({ isActive }) => {
                const style =
                  "px-5 pb-[14px] pt-[15px] text-sm hover:text-main";
                return isActive ? `bg-main text-white ${style}` : `${style}`;
              }}
            >
              {<span>{`${item.title} (${item.productCount})`}</span>}
            </NavLink>
          ))
        ) : (
          <Skeleton
            count={9}
            width="70%"
            className="mx-5 mb-[12px] mt-[15px]"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

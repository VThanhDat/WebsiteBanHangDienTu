import React from "react";
import { navigation } from "../utils/constants";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="flex h-[48px] w-full max-w-main items-center border-y py-2 text-sm max-xl:px-3">
      {navigation.map((item) => (
        <NavLink
          to={item.path}
          key={item.id}
          className={({ isActive }) =>
            isActive
              ? "text-main hover:text-main max-md:flex-1 max-md:text-center md:pr-12"
              : "hover:text-main max-md:flex-1 max-md:text-center md:pr-12"
          }
        >
          {item.value}
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import path from "../utils/path";

const TopHeader = () => {
  // const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <div className="flex h-[38px] w-full justify-center bg-main">
      <div className="flex w-full max-w-main items-center justify-between text-xs text-white max-xl:px-3">
        <span className="mr-4">ORDER ONLINE OR CALL US (+84) 32 XXXX XXX</span>
        <span>Welcome to Digital World</span>
        <Link
          className="transition-colors hover:text-gray-800"
          to={`/${path.LOGIN}`}
        >
          Sign In or Create Account
        </Link>
      </div>
    </div>
  );
};

export default memo(TopHeader);

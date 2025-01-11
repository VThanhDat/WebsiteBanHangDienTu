import React from "react";
import logo from "../assets/logo.png";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";

const { AiFillPhone, MdEmail, BsFillBagFill, FaUserCircle } = icons;

const Header = () => {
  return (
    <div className="flex h-[110px] w-full max-w-main justify-between py-[35px] max-xl:px-3">
      <Link to={`/${path.HOME}`} className="flex items-center">
        <img src={logo} alt="logo" className="w-[234px] object-contain" />
      </Link>

      <div className="flex text-[13px]">
        <div className="flex flex-col items-center border-r px-6 max-lg:hidden">
          <span className="flex items-center gap-4">
            <AiFillPhone color="red" />
            <span className="font-semibold">(+84) 32 XXXX XXX</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col items-center border-r px-6 max-md:hidden">
          <span className="flex items-center gap-4">
            <MdEmail color="red" />
            <span className="font-semibold">support@support.com.vn</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 border-r px-6 hover:cursor-pointer hover:text-main max-md:ml-3 max-md:px-3">
          <BsFillBagFill color="red" size={20} />
          <span className="text-sm">0 item(s)</span>
        </div>
        <div className="relative flex items-center justify-center px-6 text-sm max-md:px-3">
          <div>
            <FaUserCircle className="cursor-pointer" size={24} />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Header;

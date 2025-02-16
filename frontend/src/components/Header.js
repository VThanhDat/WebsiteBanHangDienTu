import React, { memo, useEffect, useRef, useState } from "react";
import { useJwt } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { appSlice } from "../store/app/appSlice";
import { userSlice } from "../store/user/userSlice";
import icons from "../utils/icons";
import path from "../utils/path";

const {
  AiFillPhone,
  MdEmail,
  BsFillBagFill,
  FaUserCircle,
  FaFacebookMessenger,
} = icons;

const Header = () => {
  const [isClickAvatar, setIsClickAvatar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const iconMenuRef = useRef(null);
  const token = useSelector((state) => state.user.token);
  const { decodedToken, isExpired } = useJwt(token);
  const isIconCardClick = useSelector((state) => state.app.isIconCardClick);
  const currentUser = useSelector((state) => state.user.current);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleToggleMenu = () => {
    setIsClickAvatar(!isClickAvatar);
  };

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      if (!iconMenuRef.current.contains(event.target)) setIsClickAvatar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

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
            <FaFacebookMessenger className="cursor-pointer" size={24} />
          </div>
        </div>
        <div className="relative flex items-center justify-center px-6 text-sm max-md:px-3">
          <div ref={iconMenuRef}>
            {isLoggedIn ? (
              <FaUserCircle
                size={30}
                className="cursor-pointer"
                onClick={handleToggleMenu}
              />
            ) : (
              <FaUserCircle
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/login`);
                }}
              />
            )}
          </div>

          <div
            ref={menuRef}
            className={`absolute right-[8px] top-[48px] w-[160px] overflow-hidden rounded-md border bg-white text-gray-700 shadow-xl ${
              !isClickAvatar && "hidden"
            }`}
          >
            <Link
              className="flex border-b border-gray-300 p-3 hover:bg-gray-100"
              onClick={handleToggleMenu}
              to={`/${path.ACCOUNT_PROFILE}`}
              state={"profile"}
            >
              My Account
            </Link>
            <Link
              to={`${path.WISHLIST}`}
              className="flex border-b border-gray-300 p-3 hover:bg-gray-100"
              onClick={handleToggleMenu}
            >
              Wish List
            </Link>
            {isLoggedIn && decodedToken?.role === "admin" && !isExpired && (
              <Link
                to={`/${path.ADMIN}`}
                className="flex border-b border-gray-300 p-3 font-semibold hover:bg-gray-100"
                onClick={handleToggleMenu}
              >
                Go To Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

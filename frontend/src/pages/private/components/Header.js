import React from "react";
import icons from "../../../utils/icons";

const { BsBell, RxAvatar, AiOutlineMenu } = icons;

const Header = ({ isHideSideBar, setIsHideSideBar }) => {
  return (
    <div className="flex h-[76px] w-full items-center justify-between border-b p-[28px]">
      <div>
        <div
          className="mr-2 flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer hover:bg-gray-200"
          onClick={() => setIsHideSideBar(!isHideSideBar)}
        >
          <AiOutlineMenu />
        </div>
      </div>
      <div className="flex">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer hover:bg-gray-200">
          <BsBell />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md border hover:cursor-pointer hover:bg-gray-200">
          <RxAvatar />
        </div>
      </div>
    </div>
  );
};

export default Header;

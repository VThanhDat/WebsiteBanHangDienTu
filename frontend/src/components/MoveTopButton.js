import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import icons from "../utils/icons";
import path from "../utils/path";

const { BsFillSuitHeartFill, AiOutlineShoppingCart, AiOutlineArrowUp } = icons;

const MoveTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const currentUser = useSelector((state) => state.user.current);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        !isVisible && "hidden"
      } fixed bottom-[20px] right-[20px] flex flex-col gap-4`}
    >
      <button
        onClick={scrollToTop}
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-main bg-white text-main shadow-xl"
      >
        <AiOutlineArrowUp size={28} />
      </button>
    </div>
  );
};

export default memo(MoveTopButton);

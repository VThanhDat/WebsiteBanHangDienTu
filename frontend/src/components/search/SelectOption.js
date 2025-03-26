import React, { useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../utils/icons";

const { FaCheck } = icons;

const SelectOption = ({ icon, onClick = () => {}, productId, path }) => {
  const [showIconSuccess, setShowIconSuccess] = useState(false);

  const handleClick = async () => {
    const isSuccess = await onClick(productId);
    if (isSuccess) {
      setShowIconSuccess(true);
      setTimeout(() => {
        setShowIconSuccess(false);
      }, 1000);
    }
  };

  return (
    <Link
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      to={path}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm hover:border-gray-800 hover:bg-gray-800 hover:text-white"
    >
      {showIconSuccess ? <FaCheck /> : icon}
    </Link>
  );
};

export default SelectOption;

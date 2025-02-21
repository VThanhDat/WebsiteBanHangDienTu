import React from "react";
import icons from "../../../utils/icons";

const { MdModeEdit } = icons;

const EditButton = ({ handleEdit = () => {} }) => {
  return (
    <button
      className="flex aspect-square h-[35px] items-center justify-center rounded-md border bg-green-500 text-white hover:cursor-pointer"
      onClick={() => handleEdit()}
    >
      <MdModeEdit size={20} />
    </button>
  );
};

export default EditButton;

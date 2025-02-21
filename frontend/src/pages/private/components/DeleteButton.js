import React, { useState } from "react";
import icons from "../../../utils/icons";

const { RiDeleteBin5Line, AiOutlineLoading } = icons;

const DeleteButton = ({
  height = "35px",
  disabled = false,
  handleDelete = async () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={`h-[${height}] flex aspect-square flex-shrink-0 items-center justify-center rounded-md border bg-white hover:cursor-pointer disabled:cursor-default disabled:opacity-25`}
      onClick={async () => {
        setIsLoading(true);
        const isSuccess = await handleDelete();
        if (isSuccess) {
          setIsLoading(false);
        }
      }}
      disabled={disabled}
    >
      {isLoading ? (
        <AiOutlineLoading className="animate-spin" />
      ) : (
        <RiDeleteBin5Line size={20} />
      )}
    </button>
  );
};

export default DeleteButton;

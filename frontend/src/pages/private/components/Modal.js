import React from "react";
import Button from "../../../components/buttons/Button";
import icons from "../../../utils/icons";

const { AiOutlineClose } = icons;

const Modal = ({
  isModalOpen = true,
  handleSubmit = () => {},
  handleCancel = () => {},
  isEdit = false,
  children,
}) => {
  const handleCloseModal = () => {
    handleCancel(false);
  };

  return (
    isModalOpen && (
      <div
        className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-overlay"
        onClick={() => handleCancel(false)}
      >
        <div
          className="max-h-[800px] w-[700px] items-center justify-center overflow-y-auto rounded-xl bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between">
            <span className="mb-4 text-lg font-semibold">
              {isEdit ? "Edit" : "Add New"}
            </span>
            <span onClick={handleCloseModal} className="hover:cursor-pointer">
              <AiOutlineClose
                size={20}
                onClick={() => {
                  handleCancel(false);
                }}
              />
            </span>
          </div>
          {children}

          <div className="mt-4 flex justify-end">
            <div className="flex">
              <Button name="OK" rounded handleClick={handleSubmit} />
            </div>
            <button
              className="ml-4 h-10 rounded-md border p-2"
              onClick={() => {
                handleCancel(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;

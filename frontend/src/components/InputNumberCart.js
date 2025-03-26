import React from "react";

const InputNumberCart = ({ number = 1, handleUpdateCart = () => {} }) => {
  const handleDownNum = () => {
    if (number > 1) {
      handleUpdateCart(+number - 1);
    }
  };
  const handleUpNum = () => {
    handleUpdateCart(+number + 1);
  };
  return (
    <div
      className={`flex h-[23px] w-[70px] justify-center border border-gray-600 bg-transparent`}
    >
      <button
        className="font-base flex-3 border-r border-gray-600 text-center"
        onClick={() => {
          handleDownNum();
        }}
      >
        -
      </button>
      <div className="flex-8">
        <input
          className="h-full w-full bg-transparent text-center text-base"
          type="number"
          value={number}
          onChange={(e) => {
            handleUpdateCart(e.target.value);
          }}
        />
      </div>
      <button
        className="font-base flex-3 border-r border-gray-600 text-center"
        onClick={() => {
          handleUpNum();
        }}
      >
        +
      </button>
    </div>
  );
};

export default InputNumberCart;

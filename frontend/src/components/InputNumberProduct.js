import React, { useEffect } from "react";

const InputNumberProduct = ({
  number = 1,
  setNumber = () => {},
  available,
}) => {
  const handleDownNum = () => {
    if (number > 1) {
      setNumber((prev) => prev - 1);
    }
  };
  const handleUpNum = () => {
    if (number < available) setNumber((prev) => prev + 1);
  };
  useEffect(() => {
    setNumber(1);
  }, [available, setNumber]);

  return (
    <div className={`flex h-[40px] w-[112px] justify-center bg-gray-200`}>
      <button
        className="font-base flex-3 border-r border-black text-center"
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
            setNumber(e.target.value);
          }}
        />
      </div>
      <button
        className="font-base flex-3 border-l border-black text-center"
        onClick={() => {
          handleUpNum();
        }}
      >
        +
      </button>
    </div>
  );
};

export default InputNumberProduct;

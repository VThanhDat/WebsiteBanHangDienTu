import React, { useState } from "react";

const FAQBox = ({ title, content }) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="mb-5">
      <div
        className={`flex justify-between px-[20px] py-[15px] hover:cursor-pointer ${
          isShow ? "bg-main text-white" : "border"
        }`}
        onClick={() => {
          setIsShow(!isShow);
        }}
      >
        <h3 className="text-base">{title}</h3>
        <span className="text-xl">{isShow ? "-" : "+"}</span>
      </div>
      {isShow && <div className="border p-5">{content}</div>}
    </div>
  );
};

export default FAQBox;

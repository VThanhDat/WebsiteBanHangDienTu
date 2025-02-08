import React, { memo, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { VoteOptions } from "../utils/constants";
import { AiFillStar } from "react-icons/ai";
import { Button } from "./";

const VoteOption = ({ nameProduct }) => {
  const modalRef = useRef();
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={modalRef}
      className="flex w-[700px] flex-col items-center justify-center gap-4 bg-white p-4"
    >
      <img src={logo} alt="logo" className="my-8 w-[300px] object-contain" />
      <h2 className="text-medium text-center text-lg">{`Voting product ${nameProduct}`}</h2>
      <textarea
        placeholder="Type something"
        className="w-full resize-y rounded-md border border-gray-300 p-2 text-sm placeholder:text-xs placeholder:italic placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      ></textarea>
      <div className="flex w-full flex-col gap-4">
        <p>How do you like this product?</p>
        <div className="flex items-center justify-center gap-4">
          {VoteOptions.map((el) => (
            <div
              className="flex h-[100px] w-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-gray-200 p-4 hover:bg-gray-300"
              key={el.id}
            >
              <AiFillStar color="gray" />
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button fw name="Submit"></Button>
    </div>
  );
};

export default memo(VoteOption);

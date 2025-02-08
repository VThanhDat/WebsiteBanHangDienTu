import React, { useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
const Votebar = ({ number, ratingCount, ratingTotal }) => {
  const percentRef = useRef();
  useEffect(() => {
    percentRef.current.style.cssText = `right: ${100 - Math.round((ratingCount * 100) / ratingTotal)}%`;
  }, [ratingCount, ratingTotal]);
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="flex w-[10%] items-center justify-center gap-1 text-sm">
        <span>{number}</span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%]">
        <div className="relative h-[6px] w-full rounded-l-full rounded-r-full bg-gray-200">
          <div
            ref={percentRef}
            className="absolute inset-0 right-8 bg-red-500"
          ></div>
        </div>
      </div>
      <div className="text-400 flex w-[15%] justify-end text-xs">{`${ratingCount || 0} reviewers`}</div>
    </div>
  );
};

export default Votebar;

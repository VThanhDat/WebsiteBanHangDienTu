import React from "react";
import avatar from "../assets/avatarDefault.png";
import moment from "moment";
import { renderStarFromNumber } from "../utils/helpers";

const Comment = ({
  image = avatar,
  name = "Anonymous",
  updatedAt,
  comment,
  star,
}) => {
  return (
    <div className="flex">
      <div className="flex-none">
        <img
          src={image}
          alt="avatar"
          className="h-[25px] w-[25px] rounded-full object-cover"
        />
      </div>
      <div className="flex flex-auto flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-xs italic">{moment(updatedAt)?.fromNow()}</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 border border-gray-300 bg-gray-100 py-2 pl-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="font-semibold">Vote:</span>
            <span className="flex items-center gap-1">
              {renderStarFromNumber(star)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </span>
          </span>
          <span className="flex gap-1">
            <span className="font-semibold">Comment:</span>
            <span className="flex items-center gap-1">{comment}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;

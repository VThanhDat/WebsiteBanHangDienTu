import React from "react";

import icons from "../../../utils/icons";

const { IoMdRemoveCircle } = icons;

const Photo = ({ index, onClick, photo }) => {
  const { src } = photo;
  const handleClick = (event) => {
    onClick(event, { photo, index });
  };

  const handleRemoveImage = (index) => {
    // images?.splice(index, 1);
    // setValue((prev) => ({ ...prev, images: images }));
  };
  return (
    <div className="relative w-1/4 p-2 hover:cursor-move">
      <img
        src={src}
        className="aspect-square border object-contain p-2"
        key={index}
        alt="item"
        onClick={onClick ? handleClick : null}
      />
      <button
        className="absolute right-1 top-1 rounded-full bg-white text-main"
        onClick={() => handleRemoveImage(index)}
      >
        <IoMdRemoveCircle size={20} />
      </button>
    </div>

    // <img
    //   style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
    //   {...photo}
    //   onClick={onClick ? handleClick : null}
    //   alt="img"
    // />
  );
};

export default Photo;

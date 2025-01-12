import React from "react";

const Product = ({ productData }) => {
  return (
    <div className="w-1/3">
      <img
        src={productData?.images[0] || ""}
        alt=""
        className="h-[243px] w-[246px] object-cover"
      ></img>
    </div>
  );
};

export default Product;

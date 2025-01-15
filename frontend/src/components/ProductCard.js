import React from "react";
import { Link } from "react-router-dom";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import path from "../utils/path";

const ProductCard = ({ slug, price, title, image, totalRatings }) => {
  return (
    <div className="flex w-1/3 pb-5 pr-5 max-md:w-1/2 max-sm:w-full">
      <div className="flex w-full border">
        <Link
          to={`/${path.DETAIL_PRODUCT}/${slug}`}
          className="flex h-[122px] w-[122px] flex-shrink-0"
        >
          <img
            src={
              image ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
            }
            alt="products"
            className="w-full object-contain p-4"
          />
        </Link>
        <div className="mt-[15px] flex w-full flex-col items-start gap-1 text-xs">
          <Link
            to={`${path.DETAIL_PRODUCT}/${slug}`}
            className="line-clamp-1 text-sm capitalize hover:text-main"
          >
            {title?.toLowerCase()}
          </Link>
          <span className="flex h-4">
            {renderStarFromNumber(totalRatings, 14)}
          </span>
          <span>{formatMoney(price)} VNĐ</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

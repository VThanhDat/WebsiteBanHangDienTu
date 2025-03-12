import React from "react";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import labelNew from "../assets/new.png";
import labelTrending from "../assets/trending.png";
import SelectOption from "./SelectOption";
import icons from "../utils/icons";
import path from "../utils/path";
import { Link } from "react-router-dom";
import { apiAddWishList } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../store/user/asyncThunk";

const { BsFillCartFill, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew, isHasLabel = true }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleAddWishList = async (wid) => {
    const response = await apiAddWishList(token, { wid });
    if (response?.success) {
      dispatch(getCurrent(token));
    }
    return response?.success;
  };

  return (
    <div className="w-full px-[10px] text-base">
      <div
        className="group flex w-full flex-col items-center border p-[15px]"
        to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
      >
        <div className="relative w-full overflow-hidden">
          <div className="absolute bottom-0 flex w-full justify-center gap-4 lg:invisible lg:group-hover:visible lg:group-hover:animate-slide-top">
            <SelectOption
              icon={<BsFillCartFill />}
              productId={productData?._id}
            />
            <SelectOption
              icon={<AiOutlineMenu />}
              path={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
            />
            <SelectOption
              icon={<BsFillSuitHeartFill />}
              onClick={handleAddWishList}
              productId={productData?._id}
            />
          </div>
          <Link
            to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
            className="flex justify-center"
          >
            <img
              src={
                productData?.thumb ||
                "https://comm.uir.ac.id/wp-content/uploads/2022/09/no-image-found.b1edc35f0fa6.png"
              }
              alt=""
              className="aspect-square w-full max-w-[274px] object-contain max-lg:w-[200]"
            />
            {isHasLabel && (
              <img
                src={isNew ? labelNew : labelTrending}
                alt="label"
                className="absolute right-[0px] top-0 h-[25px] w-[70px] object-contain"
              />
            )}
          </Link>
        </div>
        <div className="mt-[15px] flex w-full flex-col items-start gap-1">
          <Link
            to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
            className="line-clamp-1 capitalize hover:text-main"
          >
            {productData?.title?.toLowerCase()}
          </Link>
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
          <span className="mb-4">{formatMoney(productData?.price)} VNĐ</span>
        </div>
      </div>
    </div>
  );
};

export default Product;

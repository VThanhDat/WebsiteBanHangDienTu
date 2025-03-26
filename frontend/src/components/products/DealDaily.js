import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetProducts } from "../../apis/product";
import { formatMoney, renderStarFromNumber } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";
import CountDown from "../common/CountDown";

const { AiFillStar, AiOutlineMenu, AiOutlineLoading } = icons;
const DealDaily = () => {
  const [dailydeal, setDailydeal] = useState(null);
  const fetchDailydeal = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 5),
      totalRatings: 5,
    });
    if (response.success) setDailydeal(response.products[0]);
  };
  useEffect(() => {
    fetchDailydeal();
  }, []);
  return (
    <div className="flex h-full max-h-full w-full flex-auto flex-col border pb-4">
      <h3 className="flex items-center justify-between p-4 text-xl">
        <span className="flex flex-1 justify-center text-red-600">
          <AiFillStar size={28} />
        </span>
        <span className="flex flex-8 justify-center font-semibold uppercase">
          Daily deals
        </span>
        <span className="flex-1"></span>
      </h3>
      {dailydeal ? (
        <>
          <div className="flex w-full flex-col items-center gap-2 pt-8 max-lg:pt-0">
            <Link
              to={`${path.DETAIL_PRODUCT}/${dailydeal?.slug}`}
              className="flex justify-center"
            >
              <img
                src={
                  dailydeal?.thumb ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                }
                alt=""
                className="w-full object-contain max-lg:w-1/2"
              />
            </Link>
            <Link
              to={`${path.DETAIL_PRODUCT}/${dailydeal?._id}`}
              className="line-clamp-1 text-center hover:text-main"
            >
              {dailydeal?.title}
            </Link>
            <span className="flex h-4">
              {renderStarFromNumber(dailydeal?.totalRatings, 20)}
            </span>
            <span>{formatMoney(dailydeal?.price)} VNĐ</span>
          </div>
          <div className="m mt-4 px-4">
            <div className="mb-4">
              <CountDown action={fetchDailydeal} />
            </div>
            <Link
              to={`${path.DETAIL_PRODUCT}/${dailydeal?.slug}`}
              className="flex w-full cursor-pointer items-center justify-center gap-2 bg-main p-2 font-medium text-white transition-colors hover:bg-gray-800"
            >
              <AiOutlineMenu />
              <span>Options</span>
            </Link>
          </div>
        </>
      ) : (
        <span className="flex w-full flex-1 items-center justify-center">
          {" "}
          <AiOutlineLoading className="mr-2 animate-spin" /> Daily deal is
          loading...
        </span>
      )}
    </div>
  );
};

export default DealDaily;

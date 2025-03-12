import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import noDataImage from "../../assets/no-wishlist.png";
import { apiRemoveWishList } from "../../apis";
import { formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";
import { getCurrent } from "../../store/user/asyncThunk";

const { AiOutlineClose, AiOutlineLoading } = icons;

const WishList = () => {
  const {
    current: currentUser,
    token,
    isLoading,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    dispatch(getCurrent(token));
  };

  const handleRemoveWishList = async (wid) => {
    const response = await apiRemoveWishList(token, { wid });
    if (response?.success) {
      fetchCurrentUser();
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className="mb-10">
      <div className="font-sm flex gap-5 border bg-gray-100 p-5 text-gray-700 max-sm:gap-3">
        <div className="flex-2">IMAGES</div>
        <div className="flex-3">NAME</div>
        <div className="flex-2">PRICE</div>
        <div className="flex-2">DETAIL</div>
        <div className="flex-1">ACTION</div>
      </div>
      {currentUser?.wishlist?.length ? (
        currentUser?.wishlist?.map((item) => (
          <div
            key={item?._id}
            className="font-sm flex items-center gap-5 border border-t-0 p-5 text-gray-700"
          >
            <>
              <div className="flex flex-2 justify-center">
                <img
                  src={item.thumb}
                  className="h-[213px] w-[213px] object-contain"
                  alt=""
                />
              </div>
              <div className="flex-3 text-sm font-medium max-sm:text-sm">
                {item.title}
              </div>
              <div className="flex-2 text-sm font-medium text-green-600 max-sm:text-sm">
                {formatMoney(item.price)} VND
              </div>
              <Link
                to={`/${path.DETAIL_PRODUCT}/${item.slug}`}
                className="flex-2 hover:text-main max-sm:text-sm"
              >
                View More
              </Link>
              <div className="flex-1 cursor-pointer justify-center text-red-500 hover:cursor-pointer hover:text-main">
                <AiOutlineClose
                  onClick={() => handleRemoveWishList(item._id)}
                />
              </div>
            </>
          </div>
        ))
      ) : !isLoading ? (
        <div className="font-sm flex items-center justify-center gap-5 border border-t-0 p-5 text-gray-700">
          <img
            className="w-[200px] object-contain"
            alt="no-data"
            src={noDataImage}
          />
        </div>
      ) : (
        <div className="ml-[10px] flex h-[50vh] w-full items-center justify-center">
          <span className="flex items-center">
            <AiOutlineLoading size={20} className="animate-spin" />
          </span>
          <span className="ml-3 text-lg">Loading wishlist...</span>
        </div>
      )}
    </div>
  );
};

export default WishList;

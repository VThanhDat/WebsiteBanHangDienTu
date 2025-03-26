import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiRemoveFromCart, apiUpdateCart } from "../../apis";
import { Button } from "../../components";
import { capitalize, formatMoney } from "../../utils/helpers";
import emptyCart from "../../assets/empty-cart.png";
import path from "../../utils/path";
import icons from "../../utils/icons";
import InputNumberCart from "../../components/InputNumberCart";
import { getCurrent } from "../../store/user/asyncThunk";

const { AiOutlineArrowRight, AiOutlineLoading } = icons;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token,
    current: currentUser,
    isLoading,
  } = useSelector((state) => state.user);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const totalPrice = useMemo(() => {
    const arrPrice = isCheck?.map(
      (item) => item.product?.price * item.quantity,
    );
    const totalPrice = arrPrice?.reduce(
      (total, currentValue) => total + currentValue,
      0,
    );
    return totalPrice;
  }, [isCheck]);

  const fetchCurrent = () => {
    dispatch(getCurrent(token));
  };

  const handleRemoveFromCart = async (cid) => {
    const response = await apiRemoveFromCart(token, { cid });
    if (response.success) {
      fetchCurrent();
    }
  };

  const handleUpdateCart = async (pid, quantity, variant) => {
    const response = await apiUpdateCart(token, { pid, quantity, variant });
    if (response?.success) {
      fetchCurrent();
    }
  };

  const handleClickCheckBox = (item) => {
    if (isCheck.some((el) => el._id === item._id)) {
      setIsCheck(isCheck.filter((el) => el._id !== item._id));
    } else {
      setIsCheck([...isCheck, item]);
    }
  };

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(currentUser?.cart?.map((item) => item));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  useEffect(() => {
    if (currentUser?.cart?.length === isCheck?.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck, currentUser]);

  useEffect(() => {
    fetchCurrent();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="flex border p-5 text-lg font-semibold text-gray-800 max-sm:hidden">
        <div className="flex flex-6 items-center">
          <div className="flex items-center">
            <input
              id="checkbox-all"
              type="checkbox"
              className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
              onChange={handleSelectAll}
              checked={isCheckAll}
            />
            <label htmlFor="checkbox" className="sr-only">
              Checkbox
            </label>
          </div>
        </div>
        <div className="flex flex-4">
          <div className="flex-1 text-center">QUANTITY</div>
          <div className="flex-3 text-end">TOTAL</div>
        </div>
      </div>
      {currentUser?.cart?.length ? (
        currentUser?.cart?.map((item) => (
          <div
            className="mt-[-1px] flex border p-5 max-sm:flex-col"
            key={item._id}
          >
            <div className="flex flex-6 max-md:flex-col md:items-center">
              <div className="flex w-full max-md:flex-col max-md:items-center">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="rounded border-gray-200 text-blue-600 focus:ring-blue-500 md:mr-5"
                    checked={isCheck.some((el) => el._id === item._id)}
                    onChange={() => handleClickCheckBox(item)}
                  />
                  <label htmlFor="checkbox" className="sr-only">
                    Checkbox
                  </label>
                </div>
                <img
                  src={item.product?.thumb}
                  alt=""
                  className="aspect-square w-full max-w-[214px] object-contain md:pr-5"
                />
              </div>
              <div className="flex w-full flex-col items-end max-md:items-center md:p-5">
                <Link
                  to={`/${path.DETAIL_PRODUCT}/${item.product?.slug}`}
                  className="font-base text-right capitalize hover:text-main"
                >
                  {item.product?.title && capitalize(item.product?.title)}
                </Link>
                <span className="text-xs">
                  {item?.variant.map(({ variant }) => variant).join(" / ")}
                </span>
                <span
                  className="mt-2 text-sm text-main hover:cursor-pointer"
                  onClick={() => {
                    handleRemoveFromCart(item._id);
                  }}
                >
                  remove
                </span>
              </div>
            </div>
            <div className="flex flex-4 items-center max-sm:flex-col max-sm:gap-2">
              <div className="flex justify-center max-sm:order-2 sm:flex-1">
                <InputNumberCart
                  number={item.quantity}
                  handleUpdateCart={(quantity) => {
                    handleUpdateCart(item.product._id, quantity, item.variant);
                  }}
                />
              </div>
              <div className="flex justify-end text-lg font-semibold text-gray-800 sm:flex-3">
                {formatMoney(item.product?.price)} VND
              </div>
            </div>
          </div>
        ))
      ) : !isLoading ? (
        <div className="mt-[-1px] flex items-center justify-center border p-5">
          <img
            className="w-[300px] object-contain"
            alt="emptycart"
            src={emptyCart}
          />
        </div>
      ) : (
        <div className="ml-[10px] flex h-[50vh] w-full items-center justify-center">
          <span className="flex items-center">
            <AiOutlineLoading size={20} className="animate-spin" />
          </span>
          <span className="ml-3 text-lg">Loading cart...</span>
        </div>
      )}

      <div className="mb-10 mt-[-1px] flex flex-col border p-5 sm:items-end">
        <div className="mb-[10px] flex items-center sm:w-[40%]">
          <p className="text-sm text-gray-600 max-sm:mr-4 sm:flex-1 sm:text-center">
            Subtotal
          </p>
          <div className="line-clamp-2 flex-1 text-xl font-semibold text-gray-800 sm:text-end">
            {formatMoney(totalPrice) || "0"} VND
          </div>
          <div></div>
        </div>
        <i className="mb-[10px] text-sm text-gray-600">
          Shipping, and discounts calculated at checkout.
        </i>
        <div className="flex gap-3">
          <div className="w-[180px] max-sm:w-full">
            <Button
              name="CHECK OUT"
              iconsAfter={<AiOutlineArrowRight />}
              handleClick={() => {
                if (isCheck?.length) {
                  navigate(`/${path.CHECKOUT}`, {
                    state: { selectedProducts: isCheck },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

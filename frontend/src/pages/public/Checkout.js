import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  apiCreateOrder,
  apiUpdateUserAddress,
  apiGetCoupons,
  apiClearCart,
  apiGetUserAddress,
} from "../../apis";
import { Button, InputField } from "../../components";
import { getCurrent } from "../../store/user/asyncThunk";
import { compareArrays, formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";
import { InputAddress } from "../../components";

const { CiDiscount1 } = icons;

const defautPayload = {
  address: "",
};

const Checkout = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  const token = useSelector((state) => state.user.token);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [payload, setPayload] = useState(defautPayload);
  const [phone, setPhone] = useState("");
  const [isDisableButtonSave, setIsDisableButtonSave] = useState(false);
  const [isDisableButtonOrder, setisDisableButtonOrder] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("offline");
  const [selectedSubMethod, setSelectedSubMethod] = useState("");

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === "online") {
      setSelectedSubMethod("paypal"); // Default khi chọn Payment Online
    } else {
      setSelectedSubMethod(""); // Xóa sub-method khi chọn Payment COD
    }
  };

  const fetchAddresses = async () => {
    const response = await apiGetUserAddress(token);
    if (response?.success) {
      setAddress(response?.userAddress?.address || []);
      setSelectedAddress(response?.userAddress?.address[0] || ""); // Mặc định chọn địa chỉ đầu tiên
    }
  };

  // Show modal select address
  const handleEdit = () => {
    setIsChange(true);
  };

  const handleBack = () => {
    setIsChange(false);
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const setDefaultState = () => {
    setIsModalOpen(false);
    setPayload(defautPayload);
  };

  const handleSetDefaultAddress = () => {
    setDefaultAddress(selectedAddress);
    setIsChange(false);
  };

  const handleCancelModal = () => {
    setDefaultState();
  };

  const handleSubmitOrder = async () => {
    let isSuccess = false;
    if (state?.selectedProducts && state?.selectedProducts?.length) {
      await Swal.fire({
        title: "Confirm your order?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Dữ liệu gửi lên
          const orderData = {
            products: state?.selectedProducts,
            coupon: selectedCoupon?._id,
            address: selectedAddress,
            paymentMethod: selectedSubMethod || selectedMethod,
            phone,
          };

          console.log("Dữ liệu gửi lên API:", orderData);

          const response = await apiCreateOrder(token, orderData);
          if (response?.success) {
            if (response?.paymentUrl) {
              localStorage.setItem(
                "pendingClearCart",
                JSON.stringify(state?.selectedProducts.map((el) => el._id)),
              );
              // Nếu có URL thanh toán, điều hướng đến đó
              window.location.href = response.paymentUrl;
            } else {
              // Nếu không có URL, xử lý đơn hàng như bình thường
              await Swal.fire("Success!", response.mes, "success").then(
                async () => {
                  const cartResponse = await apiClearCart(token, {
                    cids: state?.selectedProducts.map((el) => el._id),
                  });
                  if (cartResponse?.success) {
                    dispatch(getCurrent(token));
                    navigate("/account/orders");
                  }
                  isSuccess = true;
                },
              );
            }
          } else {
            isSuccess = true;
            Swal.fire("Error!", response.mes, "error");
          }
        } else {
          isSuccess = true;
        }
      });
    } else {
      isSuccess = true;
    }
    return isSuccess;
  };

  const handleSubmitModal = async () => {
    const response = await apiUpdateUserAddress(token, {
      address: [...address, payload.address],
    });

    if (response?.success) {
      Swal.fire("Success!", response.mes, "success").then(() => {
        fetchAddresses();
      });
    } else {
      Swal.fire("error!", response.mes, "error");
    }

    setDefaultState();
    return true;
  };

  const fetchCoupon = async () => {
    const response = await apiGetCoupons();
    if (response?.success) setCoupons(response?.coupons);
  };

  const subTotal = useMemo(() => {
    return (
      state?.selectedProducts?.reduce(
        (total, item) => (total += +item?.product.price),
        0,
      ) || 0
    );
  }, [state]);

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
  };

  useEffect(() => {
    setSelectedCoupon(coupons[0]);
  }, [coupons]);

  useEffect(() => {
    if (isDisableButtonSave && state?.selectedProducts?.length) {
      setisDisableButtonOrder(false);
    } else {
      setisDisableButtonOrder(true);
    }
  }, [isDisableButtonSave, address, state]);

  useEffect(() => {
    if (Array.isArray(currentUser?.address)) {
      if (compareArrays(currentUser.address, address)) {
        setIsDisableButtonSave(true);
      } else {
        setIsDisableButtonSave(false);
      }
    }
  }, [address, currentUser?.address]);

  useEffect(() => {
    if (currentUser?.phone) setPhone(currentUser?.phone);
    if (currentUser?.address) {
      setAddress(currentUser.address || []);
      setSelectedAddress(currentUser.address[0] || ""); // Mặc định chọn địa chỉ đầu tiên
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCoupon();
    fetchAddresses(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (address.length > 0) {
      setDefaultAddress(address[0]); // Mặc định địa chỉ đầu tiên
    }
  }, [address]);

  return (
    <div className="mb-10 flex-col">
      {/* Delivery address */}
      {!isChange ? (
        <div className="border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Delivery address</h2>
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center gap-4">
              <span className="flex-none font-medium">
                {currentUser?.firstName} {currentUser?.lastName} (+
                {currentUser?.phone})
              </span>
              <span className="flex-1 text-center text-sm text-gray-500">
                {defaultAddress}
              </span>
            </div>
            <div className="flex flex-none items-center gap-2 text-sm">
              <span className="text-gray-500">Default</span>
              <button
                className="text-blue-500 hover:underline"
                onClick={handleEdit}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="mb-3 text-lg font-semibold">Delivery address</h2>
            <div className="mt-3 flex justify-end space-x-2">
              <button
                className="rounded-md border px-4 py-2 hover:bg-gray-100"
                onClick={handleShowModal}
              >
                + Add new address
              </button>
              <button
                className="rounded-md border px-4 py-2 hover:bg-gray-100"
                onClick={handleSetDefaultAddress}
              >
                Setup address
              </button>
            </div>
          </div>
          {address.map((addr, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center py-2"
            >
              <input
                type="radio"
                name="address"
                value={addr}
                checked={selectedAddress === addr}
                onChange={() => setSelectedAddress(addr)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex w-full items-center gap-4 pl-3">
                <span className="flex-none font-medium">
                  {currentUser?.firstName} {currentUser?.lastName} (+
                  {currentUser?.phone})
                </span>
                <span className="text-center text-sm text-gray-500">
                  {addr}
                </span>
              </div>
              {/* Hiển thị "Mặc định" nếu đây là địa chỉ được chọn */}
              {defaultAddress === addr && (
                <div className="flex flex-none items-center gap-2 text-sm">
                  <span className="text-gray-500">Default</span>
                </div>
              )}
            </label>
          ))}

          <div className="mt-4 flex items-center justify-between">
            <button
              className="rounded-md border px-4 py-2 hover:bg-gray-100"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>
      )}
      {/* End delivery address */}
      <div className="flex flex-1 flex-col justify-between border border-l-0 bg-[#fafafa] p-[32px]">
        <div className="mb-5 max-h-[512px] overflow-y-scroll">
          {state?.selectedProducts.length ? (
            state?.selectedProducts?.map((item) => (
              <div
                className="mb-3 mt-3 flex max-sm:flex-col max-sm:items-center"
                key={`${item._id}`}
              >
                <div className="relative aspect-square w-[76px]">
                  <img
                    alt="product"
                    src={item?.product?.thumb}
                    className="rounded-xl border border-gray-400"
                  />
                  <div className="absolute right-[-8px] top-[-8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gray-600 text-white">
                    {item.quantity}
                  </div>
                </div>
                <span className="flex flex-1 flex-col justify-center pl-5 max-sm:pl-0">
                  <span className="mb-2 text-base font-semibold text-gray-900 max-sm:text-center">
                    {item.product.title}
                  </span>
                  <span className="text-sm text-gray-700">
                    {item.variant.map((vari, index) => {
                      return (
                        <span key={index}>
                          {index !== 0 && <span className="p-1">/</span>}
                          <span>{vari?.variant}</span>
                        </span>
                      );
                    })}
                  </span>
                </span>
                <span className="flex items-center justify-center pl-5 text-base font-medium text-gray-900 max-sm:pl-0">
                  {formatMoney(item.product.price)} VND
                </span>
              </div>
            ))
          ) : (
            <i>No product is dropped into cart</i>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="mr-4 text-lg font-medium">Coupon:</span>
            {coupons?.length ? (
              <div className="flex max-w-[450px] flex-1 gap-3 overflow-x-scroll">
                {coupons?.map((coupon) => (
                  <div
                    key={coupon?._id}
                    className={`flex flex-col rounded-lg border-2 bg-white px-4 py-2 text-base font-medium hover:cursor-pointer hover:bg-gray-50 ${
                      selectedCoupon?._id === coupon?._id && "border-main"
                    }`}
                    onClick={() => handleSelectCoupon(coupon)}
                  >
                    <span>{coupon?.title}</span>
                    <div className="flex items-center justify-end gap-1">
                      <CiDiscount1 size={20} />
                      <span>{`${coupon.discount}%`}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <i>No coupon is available</i>
            )}
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-lg font-medium">Subtotal:</span>
            <span className="text-base font-medium">
              {formatMoney(subTotal)} VND
            </span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-lg font-medium">Shipping:</span>
            <span className="text-base font-medium">
              {formatMoney(Math.round(subTotal * 0.02))} VND
            </span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-lg font-medium">Discounts:</span>
            <span className="text-base font-medium">
              {selectedCoupon
                ? "-" +
                  formatMoney(
                    Math.round((subTotal * selectedCoupon?.discount) / 100),
                  )
                : 0}{" "}
              VND
            </span>
          </div>

          <div className="max-w-3xl border-b border-gray-200 pb-4">
            <div className="mb-2 flex items-center">
              <h3 className="mr-4 text-lg font-medium">Payment method:</h3>

              {/* Main payment methods */}
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded border px-4 py-2 ${
                    selectedMethod === "online"
                      ? "border-green-500 bg-white text-green-500"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  } transition-colors duration-200`}
                  onClick={() => handleMethodSelect("online")}
                >
                  Payment Online
                </button>

                <button
                  className={`rounded border px-4 py-2 ${
                    selectedMethod === "offline"
                      ? "border-green-500 bg-white text-green-500"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  } transition-colors duration-200`}
                  onClick={() => handleMethodSelect("offline")}
                >
                  Payment COD
                </button>
              </div>
            </div>

            {/* Sub-methods for online payment */}
            {selectedMethod === "online" && (
              <div className="ml-auto mt-2 flex flex-wrap gap-2 pl-48">
                <button
                  className={`rounded border px-4 py-2 ${
                    selectedSubMethod === "paypal"
                      ? "border-green-500 bg-white text-green-500"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  } transition-colors duration-200`}
                  onClick={() => setSelectedSubMethod("paypal")}
                >
                  Payment PAYPAL
                </button>

                <button
                  className={`rounded border px-4 py-2 ${
                    selectedSubMethod === "momo"
                      ? "border-green-500 bg-white text-green-500"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  } transition-colors duration-200`}
                  onClick={() => setSelectedSubMethod("momo")}
                >
                  Payment MoMo
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t py-3">
            <span className="text-lg font-semibold">TOTAL:</span>
            <span className="text-lg font-medium">
              {selectedCoupon
                ? formatMoney(
                    subTotal +
                      Math.round(subTotal * 0.02) -
                      Math.round((subTotal * +selectedCoupon?.discount) / 100),
                  )
                : formatMoney(subTotal + Math.round(subTotal * 0.02))}{" "}
              VND
            </span>
          </div>

          <div className="flex justify-end">
            <div className="w-[100px]">
              <Button
                name={"Order"}
                rounded
                disabled={isDisableButtonOrder}
                handleClick={handleSubmitOrder}
              />
            </div>
          </div>
        </div>
      </div>
      {/* modal */}
      <InputAddress
        isModalOpen={isModalOpen}
        handleCancel={handleCancelModal}
        handleSubmit={handleSubmitModal}
      >
        <InputField
          title="Address"
          nameKey="address"
          value={payload.address}
          setValue={setPayload}
        />
      </InputAddress>
    </div>
  );
};

export default Checkout;

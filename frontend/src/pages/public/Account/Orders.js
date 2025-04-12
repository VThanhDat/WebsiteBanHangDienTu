import React, { useEffect, useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import path from "../../../utils/path";
import { formatMoney } from "../../../utils/helpers";
import { apiUserOrders, apiCancelOrder } from "../../../apis/order";
import Swal from "sweetalert2";
import { Button } from "components";
import { useSelector } from "react-redux";

import icons from "../../../utils/icons";

const { AiOutlineLoading } = icons;

const orderStatuses = [
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Waiting", label: "Waiting" },
  { value: "Delivering", label: "Delivering" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

const Orders = () => {
  const { token, isLoading } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [statusSelected, setStatusSelected] = useState("");

  const fetchUserOrders = async (statusSelected) => {
    const response = await apiUserOrders(token, { status: statusSelected });
    if (response?.success) {
      setData(response.userOrders);
    }
  };

  const handleCancelOrder = async (oid) => {
    let isSuccess = false;
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel this order!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiCancelOrder(token, oid);
        if (response?.success) {
          isSuccess = true;
          await Swal.fire("Success!", response.mes, "success").then(() => {
            fetchUserOrders(statusSelected);
          });
        } else {
          isSuccess = true;
          Swal.fire("error!", response.mes, "error");
        }
      } else {
        isSuccess = true;
      }
    });
    return isSuccess;
  };

  useEffect(() => {
    fetchUserOrders(statusSelected);
  }, [statusSelected]);

  return (
    <div className="bg-gray-100 p-4">
      <div className="mx-auto max-w-3xl">
        {/* Tab navigation */}
        <div className="scrollbar-hide mb-4 overflow-x-auto whitespace-nowrap border-b border-gray-300">
          <div className="inline-flex">
            {orderStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusSelected(status.value)}
                className={`flex-shrink-0 border-b-2 ${
                  statusSelected === status.value
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-gray-500 hover:border-red-300 hover:text-gray-700"
                } px-4 py-3 font-medium transition-all`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        {/* Orders */}
        {data.length ? (
          data.map((order) => (
            <div
              key={order?._id}
              className="mb-4 overflow-hidden rounded-md bg-white shadow-sm"
            >
              {/* Shop header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center space-x-2">
                  <button className="rounded-sm bg-red-500 px-2 py-1 text-xs text-white">
                    Favourite
                  </button>
                  <div className="flex items-center space-x-1">
                    <ShoppingBag size={16} className="text-gray-700" />
                    <span className="text-sm font-medium">DIGITAL SHOP</span>
                  </div>
                  <Link
                    to="/"
                    className="flex items-center space-x-1 rounded-sm border border-gray-300 px-2 py-1 text-xs"
                  >
                    <Heart size={12} className="text-gray-700" />
                    <span>View shop</span>
                  </Link>
                </div>
                <div className="text-sm font-medium text-red-500">
                  {order.status}
                </div>
              </div>
              {/* Order items */}
              <div className="divide-y divide-gray-100">
                {order.products?.map((item) => (
                  <div key={item.id} className="flex items-center p-4">
                    <div className="mb-3 mt-3 flex w-full items-center justify-between max-sm:flex-col max-sm:items-center max-sm:gap-2">
                      {/* Left - Ảnh + Thông tin */}
                      <div className="flex items-start max-sm:flex-col max-sm:items-center max-sm:text-center">
                        {/* Ảnh */}
                        <div className="relative aspect-square w-[76px]">
                          <img
                            alt="product"
                            src={item?.product?.thumb}
                            className="rounded-xl border border-gray-400"
                          />
                          <div className="absolute right-[-8px] top-[-8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gray-600 text-white">
                            {item?.quantity}
                          </div>
                        </div>

                        {/* Tiêu đề + Biến thể */}
                        <div className="flex flex-col justify-center pl-5 max-sm:pl-0 max-sm:pt-2">
                          <Link
                            className="mb-2 text-base font-semibold text-gray-900 hover:text-main max-sm:mb-1"
                            to={`/${path.PRODUCTS}/${item?.product?.slug}`}
                          >
                            {item?.product?.title}
                          </Link>
                          <span className="text-sm text-gray-700">
                            {item.variant?.map((vari, index) => (
                              <span key={index}>
                                {index !== 0 && <span className="px-1">/</span>}
                                <span>{vari?.variant}</span>
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>

                      {/* Right - Giá */}
                      <span className="text-base font-medium text-gray-900 max-sm:pt-2">
                        {formatMoney(item?.product?.price)} VND
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Order total */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Shipping Address: </span>
                  <span className="mt-1">{order.address}</span>
                  <br />
                  <span className="font-semibold">Phone: </span>
                  <span className="mt-1">{order.phone}</span>
                  <br />
                  <span className="font-semibold">Payment: </span>
                  <span className="mt-1 uppercase">{order.paymentMethod}</span>
                </div>

                <div className="flex flex-col items-center text-sm">
                  <span className="flex items-center font-semibold text-gray-600">
                    <ShoppingBag size={16} className="mr-1 text-red-500" />
                    TOTAL:
                    <span className="ml-1 text-lg font-medium text-red-500">
                      {order.total?.toLocaleString() || "0"}₫
                    </span>
                  </span>
                  {order.status === "Pending" && (
                    <Button
                      name="Cancelled"
                      handleClick={() => handleCancelOrder(order?._id)}
                    ></Button>
                  )}
                </div>
              </div>
              {/* Shop footer (second order only) */}
              {order.id === 2 && (
                <div className="flex items-center justify-between border-t border-gray-100 p-4">
                  <div className="flex items-center space-x-2">
                    <button className="rounded-sm bg-red-500 px-2 py-1 text-xs text-white">
                      Yêu thích
                    </button>
                    <div className="flex items-center space-x-1">
                      <ShoppingBag size={16} className="text-gray-700" />
                      <span className="text-sm font-medium">Eiser shop</span>
                    </div>
                    <button className="flex items-center space-x-1 rounded-sm border border-gray-300 px-2 py-1 text-xs">
                      <Heart size={12} className="text-gray-700" />
                      <span>Xem shop</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : !isLoading ? (
          <i>{`There is no order in "${statusSelected ? statusSelected.toLowerCase() : "all"}" yet`}</i>
        ) : (
          <div className="ml-[10px] flex h-[50vh] w-full items-center justify-center">
            <span className="flex items-center">
              <AiOutlineLoading size={20} className="animate-spin" />
            </span>
            <span className="ml-3 text-lg">Loading orders...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

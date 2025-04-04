import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiGetOneOrder, apiUpdateStatusOrder } from "../../../../apis/order";
import { formatMoney } from "../../../../utils/helpers";
import { Button } from "../../../../components";
import icons from "../../../../utils/icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const { CiDiscount1 } = icons;

const OrderDetailTable = () => {
  const { oid } = useParams();
  const [data, setData] = useState(null);

  const token = useSelector((state) => state.user.token);

  const fetchOrder = async () => {
    const response = await apiGetOneOrder(token, oid);
    if (response?.success) {
      setData(response.order);
    } else {
      setData([]); // Đảm bảo `data` luôn có giá trị
    }

    return response?.success;
  };

  const subTotal = useMemo(() => {
    return (
      data?.products?.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ) || 0
    );
  }, [data]);

  const handleConfirmOrder = async () => {
    let newStatus;

    // Xử lý trạng thái dựa trên nút bấm
    if (data?.status === "Pending" || data?.status === "Paid") {
      newStatus = "Confirm"; // Nếu trạng thái là Pending hoặc Paid thì chuyển thành Confirm
    } else if (data?.status === "Waiting") {
      newStatus = "Send"; // Nếu trạng thái là Waiting thì chuyển thành Send
    } else if (data?.status === "Delivering") {
      newStatus = "Success"; // Nếu trạng thái là Delivering thì chuyển thành Success
    } else {
      toast.error("Invalid order status for update!");
      return false;
    }

    const result = await apiUpdateStatusOrder(token, oid, {
      status: newStatus,
    });

    if (result?.success) {
      toast.success(result?.message || `Order ${newStatus.toLowerCase()}ed.`);
      fetchOrder(); // Gọi lại thông tin đơn hàng mới
      return true;
    } else {
      toast.error(result?.message || "Something went wrong!");
      return false;
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="mb-10 flex-col">
      <div className="border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Delivery address</h2>
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center gap-4">
            <span className="flex-none font-medium">
              {data?.orderBy.firstName} {data?.orderBy.lastName} (+
              {data?.phone})
            </span>
          </div>
          <div className="flex flex-none items-center gap-2 text-sm">
            <span className="text-gray-500">{data?.address}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between border border-l-0 bg-[#fafafa] p-[32px]">
        <div className="mb-5 max-h-[512px] overflow-y-scroll">
          {data?.products.length ? (
            data?.products.map((item) => (
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
          <div className="mb-2 flex">
            <span className="mr-4 text-lg font-medium">Coupon:</span>
            <div className="flex max-w-[450px] gap-3 overflow-x-scroll">
              <div
                key={data?.coupon._id}
                className="rounded-lg border-2 border-main bg-white px-4 py-2 text-base font-medium hover:cursor-pointer hover:bg-gray-50"
              >
                <span>{data?.coupon.title}</span>
                <div className="flex items-center justify-end gap-1">
                  <CiDiscount1 size={20} />
                  <span>{`${data?.coupon.discount}%`}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-3xl pb-4">
            <div className="mb-2 flex items-center">
              <h3 className="mr-4 text-lg font-medium">Order status:</h3>

              <div className="flex flex-wrap gap-2">
                <button className="rounded border border-green-500 bg-white px-4 py-2 text-green-500">
                  {data?.status}
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-3xl border-b border-gray-200 pb-4">
            <div className="mb-2 flex items-center">
              <h3 className="mr-4 text-lg font-medium">Payment method:</h3>

              <div className="flex flex-wrap gap-2">
                <button className="rounded border border-green-500 bg-white px-4 py-2 text-green-500">
                  {data?.paymentMethod}
                </button>
              </div>
            </div>
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
              {data?.coupon._id
                ? "-" +
                  formatMoney(
                    Math.round((subTotal * data?.coupon.discount) / 100),
                  )
                : 0}
              VND
            </span>
          </div>
          <div className="flex justify-between border-t py-3">
            <span className="text-lg font-semibold">TOTAL:</span>
            <span className="text-lg font-medium">
              {data?.coupon._id
                ? formatMoney(
                    subTotal +
                      Math.round(subTotal * 0.02) -
                      Math.round((subTotal * +data?.coupon.discount) / 100),
                  )
                : formatMoney(subTotal + Math.round(subTotal * 0.02))}{" "}
              VND
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          {["Pending", "Paid", "Waiting", "Delivering"].includes(
            data?.status,
          ) && (
            <div className="w-[100px]">
              <Button
                name={
                  data?.status === "Waiting"
                    ? "Send"
                    : data?.status === "Delivering"
                      ? "Success"
                      : "Confirm"
                }
                rounded
                handleClick={handleConfirmOrder}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailTable;

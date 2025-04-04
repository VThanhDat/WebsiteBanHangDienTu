import React, { useEffect, useState } from "react";
import { apiGetOrders } from "../../../../apis";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import InputSelect from "../../../../components/inputs/InputSelect";
import moment from "moment";
import path from "utils/path";

const statusSelect = [
  { value: "", label: "Order Status" }, // Added a default option
  { value: "Cancelled", label: "Cancelled" },
  { value: "Paid", label: "Paid" },
  { value: "Shipping", label: "Shipping" },
  { value: "Pending", label: "Pending" },
  { value: "Returning", label: "Returning" },
  { value: "Delivered", label: "Delivered" },
];

const OrderTable = () => {
  const [data, setData] = useState(null);
  const token = useSelector((state) => state.user.token);
  const [selectedStatus, setSelectedStatus] = useState(statusSelect[0]);
  const navigate = useNavigate();

  //PAGINATION
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);
  const [limitItem, setLimitItem] = useState(20);
  useEffect(() => {
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === "page") setCurrentPage(+value || 1);
      if (param === "limit") setLimitItem(+value || 20);
    }
  }, [searchParams]);

  const handleNavigateToDetail = (oid) => {
    navigate(`/${path.ORDER_DETAIL}/${oid}`);
  };

  // Handle status change from dropdown
  const handleStatusChange = (selected) => {
    setSelectedStatus(selected);
  };

  const fetchOrders = async () => {
    const query = {
      sort: "-createdAt",
      limit: limitItem,
      page: currentPage,
    };

    if (selectedStatus?.status) {
      query.status = selectedStatus.status;
    }

    const response = await apiGetOrders(token, query);
    if (response?.success) {
      setData(response.orders);
      setTotalItem(response?.counts);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, limitItem, selectedStatus]);

  return (
    <div className="relative">
      {/* Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <InputSelect
            isMulti={false}
            title="Order Status"
            nameKey="status"
            selectOptions={statusSelect}
            defaultValue={selectedStatus}
            setValue={handleStatusChange}
          />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <RefreshButton handleClick={fetchOrders} />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-[10%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Order By
                  </th>
                  <th
                    scope="col"
                    className="w-[7%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Coupon
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="w-[12%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="w-[8%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Method
                  </th>
                  <th
                    scope="col"
                    className="w-[8%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Created at
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-3 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.map((item) => (
                  <tr className="" key={item._id}>
                    <td className="break-words py-4 pl-3 text-sm font-medium text-gray-800">
                      {item._id}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      <div className="flex flex-col">
                        <span>
                          {item?.orderBy?.firstName} {item?.orderBy?.lastName}
                        </span>
                        <span>{item?.orderBy?.email}</span>
                        <span>{item?.orderBy?.phone}</span>
                      </div>
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      {item.coupon
                        ? `${item?.coupon?.title} (${item?.coupon?.discount}%)`
                        : "None"}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      {item?.status}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      {item?.address}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      {item?.paymentMethod}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm text-gray-800">
                      {moment(item?.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                      <div
                        className="flex cursor-pointer items-center justify-end gap-2 text-blue-500"
                        onClick={() => handleNavigateToDetail(item._id)}
                      >
                        Detail Orders
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="my-10 flex justify-center">
        <Pagination
          totalItem={totalItem}
          currentPage={currentPage}
          limitItem={limitItem}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderTable;

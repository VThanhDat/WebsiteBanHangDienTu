import React, { useEffect, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import Button from "../../../../components/buttons/Button";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import InputField from "../../../../components/inputs/InputField";
import {
  apiAddCoupon,
  apiDeleteCoupon,
  apiDeleteManyCoupons,
  apiEditCoupon,
  apiGetCoupons,
} from "../../../../apis/coupon";
import moment from "moment";

const defaultPayload = {
  _id: "",
  title: "",
  discount: "",
  expiry: "",
};

const selectSearchOptions = [{ value: "title", label: "Title" }];
const CouponTable = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (data?.length === isCheck?.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck, data]);

  const setDefaultState = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setPayload(defaultPayload);
  };

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data.map((item) => item._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClickCheckBox = (id) => {
    if (isCheck.includes(id)) {
      setIsCheck(isCheck.filter((item) => item !== id));
    } else {
      setIsCheck([...isCheck, id]);
    }
  };

  const fetchCoupons = async (params) => {
    const response = await apiGetCoupons(params);
    if (response?.success) {
      setData(response.coupons);
    } else {
      setData([]); // Đảm bảo `data` luôn có giá trị
    }

    return response?.success;
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setData((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        return newOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
      return sortedData;
    });
  };

  const handleEdit = (coupon) => {
    const { _id, title, expiry, discount } = coupon;

    setIsModalOpen(true);
    setIsEdit(true);
    setPayload({
      _id,
      title,
      expiry: expiry ? new Date(expiry) : null,
      discount,
    });
  };

  const handleDelete = async (cpid) => {
    let isSuccess = false;
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteCoupon(token, cpid);
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            fetchCoupons();
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

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setDefaultState();
  };

  const handleDeleteSelected = async () => {
    let isSuccess = false;
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteManyCoupons(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            fetchCoupons();
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

  const handleSubmitModal = async () => {
    const { _id, ...data } = payload;
    if (isEdit) {
      const response = await apiEditCoupon(token, _id, data);
      if (response?.success) {
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchCoupons();
        });
      } else {
        Swal.fire("error!", response.mes, "error");
      }
    } else {
      const response = await apiAddCoupon(token, data);
      if (response?.success) {
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchCoupons();
        });
      } else {
        Swal.fire("error!", response.mes, "error");
      }
    }
    setDefaultState();

    //trigger stop loading
    return true;
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <SearchBox options={selectSearchOptions} fetch={fetchCoupons} />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchCoupons} />
          <Button name="Add new" rounded handleClick={handleAddNew} />
        </div>
      </div>
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-[5%] py-3 pl-4">
                    <div className="flex h-5 items-center">
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
                  </th>
                  <th
                    scope="col"
                    className="w-[8%] px-6 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="flex cursor-pointer items-center gap-2 px-2 py-3 text-left text-xs font-bold uppercase text-gray-500"
                    onClick={handleSort}
                  >
                    title
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-6 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    discount(%)
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-6 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Expiry
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-6 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.map((item) => (
                  <tr className="" key={item._id}>
                    <td className="py-3 pl-4">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          checked={isCheck.includes(item._id)}
                          onChange={() => handleClickCheckBox(item._id)}
                        />
                        <label htmlFor="checkbox" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </td>
                    <td className="break-words px-6 py-4 text-sm font-medium text-gray-800">
                      {item._id}
                    </td>
                    <td className="break-words px-6 py-4 text-sm text-gray-800">
                      {item.title}
                    </td>

                    <td className="break-words px-6 py-4 text-sm text-gray-800">
                      {item?.discount}
                    </td>
                    <td className="break-words px-6 py-4 text-sm text-gray-800">
                      {moment(item?.expiry).format("HH:mm:ss DD/MM/YYYY")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <EditButton handleEdit={() => handleEdit(item)} />
                        <DeleteButton
                          handleDelete={() => handleDelete(item._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal
        isModalOpen={isModalOpen}
        isEdit={isEdit}
        handleCancel={handleCancelModal}
        handleSubmit={handleSubmitModal}
      >
        <InputField
          title="Title"
          nameKey="title"
          value={payload.title}
          setValue={setPayload}
        />
        <InputField
          title="Discount(%)"
          type="number"
          nameKey="discount"
          value={payload.discount}
          setValue={setPayload}
        />
        <InputField
          title="Expiry(HH:mm:ss DD/MM/YYYY)"
          nameKey="expiry"
          value={payload.expiry}
          setValue={setPayload}
        />
      </Modal>
    </div>
  );
};

export default CouponTable;

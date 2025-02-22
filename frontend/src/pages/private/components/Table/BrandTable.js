import React, { useEffect, useState } from "react";
import {
  apiGetBrands,
  apiDeleteBrand,
  apiAddBrand,
  apiEditBrand,
  apiDeleteManyBrands,
} from "../../../../apis";
import Button from "../../../../components/Button";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import InputField from "../../../../components/InputField";

const defautPayload = {
  _id: "",
  title: "",
};

const selectSearchOptions = [{ value: "title", label: "Title" }];

export default function BrandTable() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [payload, setPayload] = useState(defautPayload);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

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
    setPayload(defautPayload);
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

  const fetchBrands = async (params) => {
    const response = await apiGetBrands(params);

    if (response?.success) {
      setData(response.brands);
    } else {
      setData([]); // Đảm bảo `data` luôn có giá trị
    }
    return response?.success;
  };

  const handleEdit = (brand) => {
    const { _id, title } = brand;
    setIsModalOpen(true);
    setIsEdit(true);
    setPayload({ _id, title });
  };

  const handleDelete = async (cid) => {
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
        const response = await apiDeleteBrand(token, cid);
        if (response?.success) {
          await Swal.fire("Success!", response.mes, "success").then(() => {
            isSuccess = true;
            fetchBrands();
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
        const response = await apiDeleteManyBrands(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          await Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            fetchBrands();
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
      const response = await apiEditBrand(token, _id, data);
      if (response?.success) {
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchBrands();
        });
      } else {
        Swal.fire("error!", response.mes, "error");
      }
    } else {
      const response = await apiAddBrand(token, data);
      if (response?.success) {
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchBrands();
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
    fetchBrands();
  }, []);

  return (
    <div className="relative">
      {/* Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        {/* SearchBox */}
        <div className="w-full sm:w-auto">
          <SearchBox options={selectSearchOptions} fetch={fetchBrands} />
        </div>

        {/* Button Group */}
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchBrands} />
          <Button name="Add new" rounded handleClick={handleAddNew} />
        </div>
      </div>

      {/* Table - Responsive */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[5%] py-3 pl-4">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                        onChange={handleSelectAll}
                        checked={isCheckAll}
                      />
                      <label className="sr-only">Checkbox</label>
                    </div>
                  </th>
                  <th className="hidden w-[20%] px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">
                    Title
                  </th>
                  <th className="hidden w-[10%] px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell">
                    Count
                  </th>
                  <th className="w-[10%] px-4 py-3 text-right text-xs font-bold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-100">
                    <td className="py-3 pl-4">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          checked={isCheck.includes(item._id)}
                          onChange={() => handleClickCheckBox(item._id)}
                        />
                        <label className="sr-only">Checkbox</label>
                      </div>
                    </td>
                    <td className="hidden break-words px-4 py-3 text-sm text-gray-800 sm:table-cell">
                      {item._id}
                    </td>
                    <td className="break-words px-4 py-3 text-sm text-gray-800">
                      {item.title}
                    </td>
                    <td className="hidden break-words px-4 py-3 text-sm text-gray-800 sm:table-cell">
                      {item?.productCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
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
      </Modal>
    </div>
  );
}

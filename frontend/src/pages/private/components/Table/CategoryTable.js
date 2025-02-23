import React, { useEffect, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa"; // Import icon sắp xếp
import {
  apiGetCategories,
  apiDeleteCategory,
  apiAddCategory,
  apiEditCategory,
  apiDeleteManyCategories,
  apiGetBrands,
  apiUpdateImageCategory,
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
import InputSelect from "../../../../components/InputSelect";
import InputFile from "../../../../components/InputFile";

const defaultPayload = {
  _id: "",
  title: "",
  brand: [],
  selectedFiles: [],
  variants: [{ label: "", variants: [""] }],
};

const selectSearchOptions = [{ value: "title", label: "Title" }];

export default function CategoryTable() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // A-Z mặc định

  const token = useSelector((state) => state.user.token);

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

  const fetchCategories = async (params) => {
    const response = await apiGetCategories(params);
    if (response?.success) {
      setData(response.prodCategories);
    } else {
      setData([]); // Đảm bảo `data` luôn có giá trị
    }
    return response?.success;
  };

  const fetchBrands = async () => {
    const response = await apiGetBrands();
    if (response?.success && response.brands) {
      const arrBrands = response.brands.map((item) => ({
        value: item._id,
        label: item.title,
      }));
      setBrands(arrBrands);
    }
  };

  const handleEdit = (item) => {
    const { _id, title, brand } = item;
    setIsModalOpen(true);
    setIsEdit(true);
    setPayload((prev) => ({
      ...prev,
      _id,
      title,
      brand,
      brandSelectDefault: brand?.map((item) => ({
        value: item._id,
        label: item.title,
      })),
    }));
  };

  const handleDelete = async (pcid) => {
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
        const response = await apiDeleteCategory(token, pcid);
        if (response?.success) {
          await Swal.fire("Success!", response.mes, "success").then(() => {
            isSuccess = true;
            fetchCategories();
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

  const handleSubmitModal = async () => {
    const { _id, selectedFiles, ...data } = payload;

    // Hàm xử lý tải ảnh lên
    const handleUpdateImageCategory = async (_id) => {
      if (!selectedFiles?.length) return; // Không làm gì nếu không có ảnh mới

      const uploaders = selectedFiles.map((file) => {
        const formData = new FormData();
        formData.append("image", file);
        return apiUpdateImageCategory(token, _id, formData);
      });

      await Promise.all(uploaders);
    };

    // Nếu đang chỉnh sửa danh mục (isEdit = true)
    if (isEdit) {
      const response = await apiEditCategory(token, _id, data);
      if (response?.success) {
        await handleUpdateImageCategory(_id);
        Swal.fire("Success!", response.mes, "success").then(fetchCategories);
      } else {
        Swal.fire("Error!", response.mes, "error");
      }
    }
    // Nếu thêm danh mục mới
    else {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key])); // Thêm tất cả thông tin danh mục

      if (selectedFiles?.length) {
        selectedFiles.forEach((file) => formData.append("image", file)); // Thêm ảnh vào formData
      }

      const response = await apiAddCategory(token, formData);

      if (!response?.success || !response?.createdProdCategory?._id) {
        console.error(
          "Error: API did not return a valid category ID",
          response,
        );
        Swal.fire("Error!", response?.mes || "Failed to add category", "error");
        return;
      }

      Swal.fire("Success!", response.mes, "success").then(fetchCategories);
    }

    setDefaultState();

    // Dừng trạng thái loading
    return true;
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
        const response = await apiDeleteManyCategories(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          await Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            apiDeleteManyCategories();
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
    if (data?.length === isCheck?.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck, data]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  return (
    <div className="relative">
      {/* Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <SearchBox options={selectSearchOptions} fetch={fetchCategories} />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchCategories} />
          <Button name="Add new" rounded handleClick={handleAddNew} />
        </div>
      </div>

      {/* Table Responsive */}
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
                    className="hidden w-[20%] px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell"
                  >
                    ID
                  </th>
                  <th
                    className="flex cursor-pointer items-center gap-2 px-4 py-3 text-left text-xs font-bold uppercase text-gray-500"
                    onClick={handleSort}
                  >
                    Title
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[15%] px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-4 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Count
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-4 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
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
                        <label htmlFor="checkbox" className="sr-only">
                          Checkbox
                        </label>
                      </div>
                    </td>
                    <td className="hidden break-words px-4 py-3 text-sm font-medium text-gray-800 md:table-cell">
                      {item._id}
                    </td>
                    <td className="break-words px-4 py-3 text-sm text-gray-800">
                      {item.title}
                    </td>
                    <td className="hidden break-words px-4 py-3 text-sm text-gray-800 sm:table-cell">
                      <div className="flex flex-wrap">
                        {item?.brand?.map((brand) => (
                          <div
                            className="my-1 mr-2 border bg-gray-100 p-1 text-xs"
                            key={brand?.title}
                          >
                            {`${brand?.title} (${brand?.productCount})`}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="hidden break-words px-4 py-3 text-sm text-gray-800 md:table-cell">
                      <img
                        className="h-[80px] w-[80px] object-contain"
                        src={item.image || "/placeholder.png"} // Sử dụng ảnh mặc định nếu không có ảnh
                        alt="Product"
                      />
                    </td>
                    <td className="break-words px-4 py-3 text-sm text-gray-800">
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
        <InputSelect
          title="Brand"
          defaultValue={payload?.brandSelectDefault}
          nameKey="brand"
          value={payload.brand}
          setValue={setPayload}
          selectOptions={brands}
        />
        <InputFile
          type="file"
          title="Image"
          nameKey="selectedFiles"
          setValue={setPayload}
        />
      </Modal>
    </div>
  );
}

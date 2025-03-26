import React, { useEffect, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  apiGetProducts,
  apiDeleteProduct,
  apiAddProduct,
  apiEditProduct,
  apiDeleteManyProducts,
  apiGetBrands,
  apiGetCategories,
  apiUpdateImageProduct,
  apiDeleteProductImage,
} from "../../../../apis";
import Button from "../../../../components/buttons/Button";
import InputField from "../../../../components/inputs/InputField";
import { formatMoney, reducedArray } from "../../../../utils/helpers";
import InputSelect from "../../../../components/inputs/InputSelect";
import InputDynamic from "../../../../components/inputs/InputDynamic";
import InputFieldValue from "../../../../components/inputs/InputVariants";
import InputFile from "../../../../components/inputs/InputFile";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Modal from "../Modal";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Pagination from "../Pagination";

const defaultPayload = {
  _id: "",
  title: "",
  price: "",
  brand: "",
  thumb: "",
  selectedFiles: [],
  description: [""],
  variants: [{ label: "", variants: [{ variant: "", quantity: "" }] }],
  category: "",
};

const selectSearchOptions = [
  { value: "title", label: "Title" },
  { value: "brand", label: "Brand" },
  { value: "category", label: "Category" },
];

const ProductTable = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [deletedImages, setDeletedImages] = useState([]);

  const token = useSelector((state) => state.user.token);

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

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    if (data?.length === isCheck?.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck, data]);

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

  const setDefaultState = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setPayload(defaultPayload);
    setDeletedImages([]);
  };

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.map((item) => item._id));
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

  const fetchProducts = async (query) => {
    const response = await apiGetProducts({
      sort: "-createdAt",
      limit: limitItem,
      page: currentPage,
      ...query,
    });
    if (response?.success) {
      setData(response.products);
      setTotalItem(response.counts);
    }
    return response?.success;
  };

  const fetchBrands = async () => {
    const response = await apiGetBrands();
    if (response?.success) {
      const arrBrands = response?.brands?.map((item) => ({
        value: item._id,
        label: item.title,
      }));
      setBrands(arrBrands);
    }
    return response?.success;
  };

  const fetchCategories = async () => {
    const response = await apiGetCategories();
    if (response?.success) {
      const arrProdCategories = response?.prodCategories?.map((item) => ({
        value: item._id,
        label: item.title,
      }));
      setCategories(arrProdCategories);
    }
    return response?.success;
  };

  const handleEdit = (product) => {
    const { brand, category, images, ...data } = product;
    setIsModalOpen(true);
    setIsEdit(true);
    setPayload((prev) => ({
      ...prev,
      ...data,
      selectedFiles: [...images], // Chỉ cần đồng bộ selectedFiles
      brand,
      brandSelectDefault: { value: brand._id, label: brand.title },
      category,
      categorySelectDefault: { value: category._id, label: category.title },
    }));
    setDeletedImages([]);
  };

  const handleDelete = async (pid) => {
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
        const response = await apiDeleteProduct(token, pid);
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            fetchProducts();
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
        const response = await apiDeleteManyProducts(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            fetchProducts();
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
    payload.variants = reducedArray(payload.variants);
    const { _id, selectedFiles, ...data } = payload;

    const handleUpdateImagesProduct = async (_id) => {
      if (deletedImages.length > 0) {
        console.log("Deleting images:", deletedImages);
        const deleteResults = await Promise.all(
          deletedImages.map(async (imageUrl) => {
            const result = await apiDeleteProductImage(token, _id, imageUrl);
            console.log(`Delete result for ${imageUrl}:`, result);
            return result;
          }),
        );
        console.log("All delete results:", deleteResults);
      }

      const uploaders = selectedFiles?.map((file) => {
        if (file instanceof File) {
          const formData = new FormData();
          formData.append("image", file);
          return apiUpdateImageProduct(token, _id, formData);
        }
        return Promise.resolve();
      });
      await Promise.all(uploaders.filter(Boolean));
    };

    if (isEdit) {
      const updatedImages = selectedFiles.filter(
        (item) => typeof item === "string",
      );
      const response = await apiEditProduct(token, _id, {
        ...data,
        images: updatedImages,
      });
      if (response?.success) {
        await handleUpdateImagesProduct(_id);
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchProducts();
        });
      } else {
        Swal.fire("error!", response.mes, "error");
      }
    } else {
      const response = await apiAddProduct(token, data);
      if (response?.success) {
        await handleUpdateImagesProduct(response?.createdProduct._id);
        Swal.fire("Success!", response.mes, "success").then(() => {
          fetchProducts();
        });
      } else {
        Swal.fire("error!", response.mes, "error");
      }
    }
    setDefaultState();
    setDeletedImages([]);
    return true;
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limitItem]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <SearchBox options={selectSearchOptions} fetch={fetchProducts} />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchProducts} />
          <Button name="Add new" rounded handleClick={handleAddNew} />
        </div>
      </div>
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
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[5%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell"
                  >
                    ID
                  </th>
                  <th
                    className="flex cursor-pointer items-center gap-2 px-2 py-3 text-left text-xs font-bold uppercase text-gray-500"
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
                    className="hidden w-[8%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[10%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[12%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell"
                  >
                    Images
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[18%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 lg:table-cell"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Variants
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[8%] px-2 py-3 text-left text-xs font-bold uppercase text-gray-500 sm:table-cell"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-2 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-2 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Sold
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-2 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="w-[7%] px-2 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-2 pl-4">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          checked={isCheck.includes(item._id)}
                          onChange={() => handleClickCheckBox(item._id)}
                        />
                      </div>
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 md:table-cell">
                      {item._id}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-800">
                      {item.title}
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 sm:table-cell">
                      {formatMoney(item.price)}
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 sm:table-cell">
                      {item?.brand?.title}
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 md:table-cell">
                      <img
                        className="h-[80px] w-[80px] object-contain"
                        src={item.thumb}
                        alt=""
                      />
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 lg:table-cell">
                      <ul className="flex flex-col">
                        {item.description?.map((desc, index) => (
                          <li className="list-disc list-outside" key={index}>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-800">
                      <ul>
                        {item?.variants?.map((variant, index) => (
                          <li key={index} className="list-disc list-outside">
                            <span className="font-semibold">
                              {variant.label}
                            </span>
                            <span>
                              :{" "}
                              {variant.variants
                                .map((el) => el.variant + `(${el.quantity})`)
                                .join(" / ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="hidden px-2 py-2 text-xs text-gray-800 sm:table-cell">
                      {item.category?.title}
                    </td>
                    <td className="px-2 py-2 text-right text-xs text-gray-800">
                      {item.totalRatings}
                    </td>
                    <td className="px-2 py-2 text-right text-xs text-gray-800">
                      {item.sold}
                    </td>
                    <td className="px-2 py-2 text-right text-xs text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-medium">
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
      <div className="my-10 flex justify-center">
        <Pagination
          totalItem={totalItem}
          currentPage={currentPage}
          limitItem={limitItem}
          onChange={setCurrentPage}
        />
      </div>
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
          type="number"
          title="Price"
          nameKey="price"
          value={payload.price}
          setValue={setPayload}
        />
        <InputSelect
          isMulti={false}
          title="Brand"
          defaultValue={payload.brandSelectDefault}
          nameKey="brand"
          setValue={setPayload}
          selectOptions={brands}
        />
        <InputSelect
          isMulti={false}
          title="Category"
          defaultValue={payload?.categorySelectDefault}
          nameKey="category"
          setValue={setPayload}
          selectOptions={categories}
        />
        <InputFile
          multiple={true}
          type="file"
          title="Images"
          images={payload?.selectedFiles}
          nameKey="selectedFiles"
          setValue={setPayload}
          setDeletedImages={setDeletedImages}
        />
        <InputDynamic
          type=""
          title="Description"
          nameKey="description"
          value={payload.description}
          setValue={setPayload}
        />
        <InputFieldValue
          title="Variants"
          nameKey="variants"
          value={payload.variants}
          setValue={setPayload}
        />
      </Modal>
    </div>
  );
};

export default ProductTable;

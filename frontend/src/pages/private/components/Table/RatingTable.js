import React, { useEffect, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  apiGetProductRatings,
  apiDeleteProductRating,
  apiDeleteManyProductRatings,
} from "../../../../apis";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import Pagination from "../Pagination";
import { compareObjects } from "../../../../utils/helpers";

const selectSearchOptions = [
  { value: "title", label: "Product Title" },
  { value: "_id", label: "Product ID" },
  { value: "ratings", label: "Rating ID" },
  { value: "postedBy", label: "User ID" },
  { value: "star", label: "Star" },
];

const RatingTable = () => {
  const [data, setData] = useState(null);
  const token = useSelector((state) => state.user.token);
  const [sortOrder, setSortOrder] = useState("asc");

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

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    if (data?.length === isCheck?.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isCheck, data]);

  const handleSelectAll = () => {
    if (isCheckAll) {
      // Bỏ chọn tất cả
      setIsCheck([]);
    } else {
      // Chọn tất cả ratings
      const allRatings = data?.flatMap((item) =>
        item.ratings.map((rating) => ({
          pid: item._id,
          rid: rating._id,
        })),
      );
      setIsCheck(allRatings);
    }
    setIsCheckAll(!isCheckAll);
  };

  const handleClickCheckBox = ({ pid, rid }) => {
    if (isCheck.some((el) => compareObjects(el, { pid, rid }))) {
      setIsCheck(
        isCheck.filter((item) => item.pid !== pid && item.rid !== rid),
      );
    } else {
      setIsCheck([...isCheck, { pid, rid }]);
    }
  };

  useEffect(() => {
    const totalRatings = data?.reduce(
      (acc, item) => acc + item.ratings.length,
      0,
    );
    setIsCheckAll(isCheck.length === totalRatings);
  }, [isCheck, data]);

  const fetchProductRatings = async (query) => {
    let formatQuery;
    if (query?.title) formatQuery = { title: query.title };
    if (query?._id) formatQuery = { _id: query._id };
    if (query?.ratings) formatQuery = { ratings: { _id: query.ratings } };
    if (query?.star) formatQuery = { ratings: { star: +query.star } };
    if (query?.postedBy)
      formatQuery = { ratings: { postedBy: query.postedBy } };

    const response = await apiGetProductRatings(token, {
      sort: "-createdAt",
      limit: limitItem,
      page: currentPage,
      ...formatQuery,
    });
    if (response?.success) {
      setData(response.products);
      setTotalItem(response.counts);
    }

    return response?.success;
  };

  const handleDelete = async (pid, rid) => {
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
        const response = await apiDeleteProductRating(token, pid, {
          rid,
        });
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            fetchProductRatings();
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
        const response = await apiDeleteManyProductRatings(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            fetchProductRatings();
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
    fetchProductRatings(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limitItem]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <SearchBox
            options={selectSearchOptions}
            fetch={fetchProductRatings}
          />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchProductRatings} />
        </div>
      </div>
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-[2%] py-3 pl-4">
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
                    className="w-[10%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    RID
                  </th>
                  <th
                    scope="col"
                    className="flex cursor-pointer items-center gap-2 px-2 py-3 text-left text-xs font-bold uppercase text-gray-500"
                    onClick={handleSort}
                  >
                    Product Title
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="w-[15%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Comment
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Posted By
                  </th>
                  <th
                    scope="col"
                    className="w-[5%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    Star
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                  >
                    PID
                  </th>

                  <th
                    scope="col"
                    className="w-[5%] px-3 py-3 text-right text-xs font-bold uppercase text-gray-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.map((item) =>
                  item?.ratings.map((rating) => (
                    <tr className="" key={rating?._id}>
                      <td className="py-3 pl-4">
                        <div className="flex h-5 items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                            checked={isCheck.some(
                              (el) =>
                                el.pid === item?._id && el.rid === rating?._id,
                            )}
                            onChange={() =>
                              handleClickCheckBox({
                                pid: item?._id,
                                rid: rating?._id,
                              })
                            }
                          />
                          <label htmlFor="checkbox" className="sr-only">
                            Checkbox
                          </label>
                        </div>
                      </td>
                      <td className="break-words py-4 pl-3 text-sm font-medium text-gray-800">
                        {rating?._id}
                      </td>
                      <td className="break-words py-4 pl-3 text-sm text-gray-800">
                        {item?.title}
                      </td>
                      <td className="break-words py-4 pl-3 text-sm text-gray-800">
                        {rating?.comment}
                      </td>
                      <td className="flex flex-col break-words py-4 pl-3 text-sm text-gray-800">
                        <span>{`${rating?.postedBy?.firstName} ${rating?.postedBy?.lastName}`}</span>
                        <span>{`ID: ${rating?.postedBy?._id}`}</span>
                      </td>
                      <td className="break-words py-4 pl-3 text-sm text-gray-800">
                        {rating?.star}
                      </td>
                      <td className="break-words py-4 pl-3 text-sm text-gray-800">
                        {item?._id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <DeleteButton
                            handleDelete={() =>
                              handleDelete(item._id, rating._id)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )),
                )}
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

export default RatingTable;

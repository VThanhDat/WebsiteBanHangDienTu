import React, { useEffect, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import {
  apiDeleteManyUsers,
  apiGetUsers,
  apiEditUser,
  apideleteUser,
} from "../../../../apis";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import InputField from "../../../../components/inputs/InputField";
import InputSelect from "../../../../components/inputs/InputSelect";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import { formatAddress } from "../../../../utils/helpers";

const defaultPayload = {
  _id: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: "",
};

const selectSearchOptions = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const UserTable = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [payload, setPayload] = useState(defaultPayload);
  const [roles, setRoles] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const token = useSelector((state) => state.user.token);

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

  const setDefaultState = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setPayload(defaultPayload);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setData((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        const titleA = a.firstName || ""; // Nếu không có firstName, dùng chuỗi rỗng
        const titleB = b.firstName || ""; // Nếu không có firstName, dùng chuỗi rỗng

        return newOrder === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });
      return sortedData;
    });
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

  const fetchUsers = async (query) => {
    const response = await apiGetUsers(token, {
      sort: "-createdAt",
      limit: limitItem,
      page: currentPage,
      ...query,
    });
    if (response?.success) {
      setData(response.users);
      setTotalItem(response?.counts);
    }

    return response?.success;
  };

  const fetchRoles = async () => {
    const response = await apiGetUsers(token, {});
    if (response?.success && response.users) {
      const arrRoles = [...new Set(response.users.map((item) => item.role))] // Lọc trùng role
        .map((role) => ({
          value: role,
          label: role.charAt(0).toUpperCase() + role.slice(1), // Chuyển đổi cho đẹp
        }));
      setRoles(arrRoles);
    }
  };

  const handleEdit = (user) => {
    const { firstName, lastName, phone, _id, role } = user;
    setIsModalOpen(true);
    setIsEdit(true);

    setPayload({
      _id,
      firstName,
      lastName,
      phone,
      roleSelectDefault: Array.isArray(role)
        ? role.map((item) => ({
            value: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
          }))
        : [
            {
              value: role,
              label: role?.charAt(0).toUpperCase() + role?.slice(1),
            },
          ],
    });
  };

  const handleDelete = async (id) => {
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
        const response = await apideleteUser(token, id);
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            fetchUsers();
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
        const response = await apiDeleteManyUsers(token, {
          _ids: isCheck,
        });
        if (response?.success) {
          isSuccess = true;
          Swal.fire("Success!", response.mes, "success").then(() => {
            setIsCheck([]);
            fetchUsers();
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

  const handleCancelModal = () => {
    setDefaultState();
  };

  const handleSubmitModal = async () => {
    const { _id, role, ...data } = payload;

    // Chuyển role từ Array thành String nếu cần
    const formattedRole = Array.isArray(role) ? role[0] : role;

    const response = await apiEditUser(token, _id, {
      ...data,
      role: formattedRole,
    });

    if (response?.success) {
      Swal.fire("Success!", response.mes, "success").then(() => {
        fetchUsers();
      });
    } else {
      Swal.fire("Error!", response.mes, "error");
    }
    setDefaultState();
  };

  const handleToggleBlock = async (user) => {
    const newBlockedStatus = !user.isBlocked; // Đảo trạng thái

    // Gửi API cập nhật trạng thái
    const response = await apiEditUser(token, user._id, {
      isBlocked: newBlockedStatus,
    });

    if (response?.success) {
      Swal.fire("Success!", "User status updated!", "success");
      fetchUsers(); // Cập nhật lại danh sách người dùng
    } else {
      Swal.fire("Error!", response.mes || "Failed to update user", "error");
    }
  };

  useEffect(() => {
    fetchUsers(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limitItem]);

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="relative">
      {/* Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="w-full sm:w-auto">
          <SearchBox options={selectSearchOptions} fetch={fetchUsers} />
        </div>
        <div className="flex w-full flex-wrap justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
          <DeleteButton
            height="40px"
            disabled={!isCheck?.length}
            handleDelete={handleDeleteSelected}
          />
          <RefreshButton handleClick={fetchUsers} />
        </div>
      </div>

      {/* Table */}
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
                      <label htmlFor="checkbox-all" className="sr-only">
                        Checkbox
                      </label>
                    </div>
                  </th>
                  <th className="w-[5%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500">
                    ID
                  </th>
                  <th
                    className="w-[7%] cursor-pointer px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                    onClick={handleSort}
                  >
                    First Name{" "}
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th
                    className="w-[7%] cursor-pointer px-3 py-3 text-left text-xs font-bold uppercase text-gray-500"
                    onClick={handleSort}
                  >
                    Last Name{" "}
                    {sortOrder === "asc" ? (
                      <FaSortAlphaDown />
                    ) : (
                      <FaSortAlphaDownAlt />
                    )}
                  </th>
                  <th className="hidden w-[12%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell">
                    Email
                  </th>
                  <th className="hidden w-[8%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500 md:table-cell">
                    Phone
                  </th>
                  <th className="hidden w-[25%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500 lg:table-cell">
                    Address
                  </th>
                  <th className="w-[5%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500">
                    Role
                  </th>
                  <th className="w-[5%] px-3 py-3 text-left text-xs font-bold uppercase text-gray-500">
                    Blocked
                  </th>
                  <th className="w-[7%] px-3 py-3 text-right text-xs font-bold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data?.map((item) => (
                  <tr key={item._id} className="text-xs sm:text-sm">
                    <td className="py-3 pl-4">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-200 text-blue-600 focus:ring-blue-500"
                          checked={isCheck.includes(item._id)}
                          onChange={() => handleClickCheckBox(item._id)}
                        />
                      </div>
                    </td>
                    <td className="py-4 pl-3 font-medium text-gray-800">
                      {item._id}
                    </td>
                    <td className="py-4 pl-3 text-gray-800">
                      {item.firstName}
                    </td>
                    <td className="py-4 pl-3 text-gray-800">{item.lastName}</td>
                    <td className="hidden py-4 pl-3 text-gray-800 md:table-cell">
                      {item?.email}
                    </td>
                    <td className="hidden py-4 pl-3 text-gray-800 md:table-cell">
                      {item?.phone}
                    </td>
                    <td className="hidden py-4 pl-3 text-gray-800 lg:table-cell">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formatAddress(item?.address),
                        }}
                      ></span>
                    </td>
                    <td className="py-4 pl-3 text-gray-800">{item.role}</td>
                    <td className="py-4 pl-3">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={Boolean(item?.isBlocked)}
                          onChange={() => handleToggleBlock(item)}
                        />
                        <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right">
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

      {/* PAGINATION */}
      <div className="my-10 flex justify-center">
        <Pagination
          totalItem={totalItem}
          currentPage={currentPage}
          limitItem={limitItem}
          onChange={setCurrentPage}
        />
      </div>

      {/* modal */}
      <Modal
        isModalOpen={isModalOpen}
        isEdit={isEdit}
        handleCancel={handleCancelModal}
        handleSubmit={handleSubmitModal}
      >
        <InputField
          title="First Name"
          nameKey="firstName"
          value={payload.firstName}
          setValue={setPayload}
        />
        <InputField
          title="Last Name"
          nameKey="lastName"
          value={payload.lastName}
          setValue={setPayload}
        />
        <InputField
          type="number"
          title="Phone"
          nameKey="phone"
          value={payload.phone}
          setValue={setPayload}
        />

        <InputSelect
          title="Role"
          nameKey="role"
          defaultValue={payload?.roleSelectDefault}
          value={payload.role}
          setValue={setPayload}
          selectOptions={roles}
        />
      </Modal>
    </div>
  );
};

export default UserTable;

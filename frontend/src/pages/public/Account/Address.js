import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUserAddress } from "../../../apis";
import { Button } from "../../../components";
import { getCurrent } from "../../../store/user/asyncThunk";
import { compareArrays } from "utils/helpers";
import { toast } from "react-toastify";

const Address = () => {
  const dispatch = useDispatch();
  const { current: currentUser } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);

  const [address, setAddress] = useState([]);
  const [addedAddresses, setAddedAddresses] = useState([]); // Lưu các địa chỉ thêm mới
  const [removedAddresses, setRemovedAddresses] = useState([]); // Lưu các địa chỉ đã xóa
  const [isDisableButtonSave, setIsDisableButtonSave] = useState(true);

  // Cập nhật khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setAddress(currentUser.address || []);
      setAddedAddresses([]); // Reset lại khi có dữ liệu mới
      setRemovedAddresses([]); // Reset lại khi có dữ liệu mới
    }
  }, [currentUser]);

  // Xử lý thay đổi địa chỉ
  const handleChangeAddress = useCallback(
    (index, value) => {
      const trimmedValue = value.trim();
      const isDuplicate = address.some(
        (addr, i) => i !== index && addr.trim() === trimmedValue,
      );

      if (isDuplicate) {
        toast.warning("This address already exists.");
        return;
      }

      setAddress((prev) => {
        const newAddress = [...prev];
        newAddress[index] = value;
        return newAddress;
      });
    },
    [address],
  );

  // Xử lý xóa địa chỉ
  const handleRemoveAddress = useCallback(
    (index) => {
      const addrToRemove = address[index];
      setRemovedAddresses((prev) => [...prev, addrToRemove]);
      setAddress((prev) => prev.filter((_, i) => i !== index));
    },
    [address],
  );

  // Thêm địa chỉ mới
  const handleAddAddress = useCallback(() => {
    setAddress((prev) => [...prev, ""]);
    setAddedAddresses((prev) => [...prev, ""]); // Đánh dấu địa chỉ thêm vào
  }, [address]);

  // Lưu địa chỉ và hiển thị thông báo khi bấm Save
  const handleSaveChange = async () => {
    let isSuccess = false;
    let toastMessage = "";

    try {
      const filteredAddress = address.filter((addr) => addr.trim() !== "");

      const response = await apiUpdateUserAddress(token, {
        address: filteredAddress,
        removedAddresses,
      });

      if (response?.success && response?.updatedUser) {
        const updatedAddress = response.updatedUser.address;
        setAddress(updatedAddress);
        setRemovedAddresses([]);

        // Kiểm tra hành động và thông báo tương ứng
        if (addedAddresses.length > 0) {
          toastMessage = "New address added!";
        } else if (removedAddresses.length > 0) {
          toastMessage = "Address removed successfully!";
        } else {
          toastMessage = "No changes made!";
        }

        // Chỉ hiển thị thông báo khi có thay đổi
        if (toastMessage) {
          toast.success(toastMessage);
        }

        if (!compareArrays(currentUser.address, updatedAddress)) {
          dispatch(getCurrent(token));
        }

        isSuccess = true;
      } else {
        toast.error("Unable to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("An error occurred while saving the address.");
    }

    return isSuccess;
  };

  // Kiểm tra xem có thay đổi gì so với địa chỉ hiện tại
  const isSameAddress = useMemo(() => {
    if (!currentUser?.address) return true;
    return compareArrays(currentUser.address, address);
  }, [address, currentUser?.address]);

  useEffect(() => {
    setIsDisableButtonSave(isSameAddress);
  }, [isSameAddress]);

  return (
    <div className="pl-5 pr-[72px]">
      <h3 className="flex h-[48px] items-center text-xl font-semibold">
        ADDRESS
      </h3>
      <div className="py-4 text-lg font-medium">
        <div className="mb-5 flex flex-col gap-4 text-base font-normal">
          <div className="flex flex-col gap-4">
            {address.length > 0 ? (
              address.map((addr, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={addr}
                    onChange={(e) => handleChangeAddress(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 p-2"
                  />
                  <button
                    className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    ✖
                  </button>
                </div>
              ))
            ) : (
              <p className="italic text-gray-500">No address added.</p>
            )}
          </div>

          <button
            onClick={handleAddAddress}
            className="mt-2 text-blue-500 underline"
          >
            +
          </button>

          <div className="flex justify-end">
            <div className="w-[100px]">
              <Button
                name="Save"
                rounded
                handleClick={handleSaveChange}
                disabled={isDisableButtonSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUserAddress } from "../../../apis";
import { Button } from "../../../components";
import { getCurrent } from "../../../store/user/asyncThunk";
import { compareArrays } from "utils/helpers";

const Address = () => {
  const dispatch = useDispatch();
  const { current: currentUser } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);

  const [address, setAddress] = useState([]);
  const [removedAddresses, setRemovedAddresses] = useState([]);
  const [isDisableButtonSave, setIsDisableButtonSave] = useState(true);

  // Update state khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setAddress(currentUser.address || []);
      setRemovedAddresses([]);
    }
  }, [currentUser]);

  const handleChangeAddress = useCallback((index, value) => {
    setAddress((prev) => {
      const newAddress = [...prev];
      newAddress[index] = value;
      return newAddress;
    });
  }, []);

  const handleRemoveAddress = useCallback(
    (index) => {
      setRemovedAddresses((prev) => [...prev, address[index]]);
      setAddress((prev) => prev.filter((_, i) => i !== index));
    },
    [address],
  );

  const handleAddAddress = useCallback(() => {
    setAddress((prev) => [...prev, ""]);
  }, []);

  const handleSaveChange = async () => {
    const response = await apiUpdateUserAddress(token, {
      address,
      removedAddresses,
    });

    if (response?.data?.updatedUser) {
      const updatedAddress = response.data.updatedUser.address;
      setAddress(updatedAddress);
      setRemovedAddresses([]);

      if (!compareArrays(currentUser.address, updatedAddress)) {
        dispatch(getCurrent(token));
      }
      return true;
    }
  };

  const isSameAddress = useMemo(() => {
    if (!currentUser?.address) return true;
    return compareArrays(currentUser.address, address);
  }, [address, currentUser?.address]);

  useEffect(() => {
    setIsDisableButtonSave(isSameAddress);
  }, [isSameAddress]);

  return (
    <div>
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

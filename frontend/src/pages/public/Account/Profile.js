import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUserInformation, apiUploadAvatar } from "../../../apis";
import { Button, InputField } from "../../../components";
import { getCurrent } from "../../../store/user/asyncThunk";
import { capitalize, compareObjects } from "../../../utils/helpers";
import defaultAvatar from "../../../assets/defaultAvatar.png";

const Profile = () => {
  const dispatch = useDispatch();
  const { current: currentUser, isLoading } = useSelector(
    (state) => state.user,
  );
  const token = useSelector((state) => state.user.token);
  const [isDisableButtonSave, setIsDisableButtonSave] = useState(true);
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  useEffect(() => {
    setPayload({
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      phone: currentUser?.phone,
    });
    setAvatar(currentUser?.avatar || "");
  }, [currentUser]);

  useEffect(() => {
    if (
      compareObjects(
        {
          firstName: currentUser?.firstName,
          lastName: currentUser?.lastName,
          phone: currentUser?.phone,
        },
        payload,
      ) &&
      currentUser
    ) {
      setIsDisableButtonSave(true);
    } else {
      setIsDisableButtonSave(false);
    }
  }, [payload]);

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file); // Dùng key đúng như backend yêu cầu

    try {
      const response = await apiUploadAvatar(token, currentUser?._id, formData);
      if (response?.data?.updatedAvatar) {
        setAvatar(response.data.updatedAvatar);
        dispatch(getCurrent(token)); // Cập nhật lại user
      }
    } catch (error) {
      console.error("Upload avatar failed:", error.response?.data || error);
    }
  };

  const handleSaveChange = async () => {
    const updateUser = [];
    updateUser.push(apiUpdateUserInformation(token, { ...payload, avatar }));
    await Promise.all(updateUser);
    dispatch(getCurrent(token));
    return true;
  };

  return (
    <div>
      <h3 className="flex h-[48px] items-center text-xl font-semibold">
        PROFILE
      </h3>
      <div className="py-4 text-lg font-medium">
        <h4 className="mb-5">ACCOUNT INFORMATION</h4>

        {/* Avatar + Form */}
        <div className="flex items-center gap-6 max-md:flex-col">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-[120px] w-[120px] overflow-hidden rounded-full border shadow">
              <img
                src={avatar || defaultAvatar}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Nút Upload */}
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Upload
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadAvatar}
            />
          </div>

          {/* Form */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center">
              <label className="flex-1">First Name</label>
              <div className="flex-4">
                {!isLoading ? (
                  <InputField
                    nameKey="firstName"
                    value={capitalize(payload?.firstName)}
                    setValue={setPayload}
                  />
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex-1">Last Name</label>
              <div className="flex-4">
                {!isLoading ? (
                  <InputField
                    nameKey="lastName"
                    value={capitalize(payload?.lastName)}
                    setValue={setPayload}
                  />
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex-1">Phone</label>
              <div className="flex-4">
                {!isLoading ? (
                  <InputField
                    nameKey="phone"
                    value={payload?.phone}
                    setValue={setPayload}
                  />
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-5 flex justify-end">
          <div className="w-[100px]">
            <Button
              name={"Save"}
              rounded
              handleClick={handleSaveChange}
              disabled={isDisableButtonSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

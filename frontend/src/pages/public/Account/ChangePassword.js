import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputField } from "../../../components";
import { apiChangePassword } from "../../../apis";
import { getCurrent } from "../../../store/user/asyncThunk";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const [payload, setPayload] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra nếu các trường còn trống thì disable button
  const isDisabled =
    !payload.currentPassword ||
    !payload.newPassword ||
    !payload.confirmPassword;

  const handleChangePassword = async () => {
    if (payload.newPassword !== payload.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (isDisabled) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiChangePassword(token, {
        oldPassword: payload.currentPassword, // Đổi tên biến theo yêu cầu backend
        newPassword: payload.newPassword,
      });

      if (response?.data?.success) {
        dispatch(getCurrent(token));
        setPayload({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h3 className="flex h-[48px] items-center text-xl font-semibold">
        CHANGE PASSWORD
      </h3>
      <div className="py-4 text-lg font-medium">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          {/* Trường nhập mật khẩu hiện tại */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Current Password
            </label>
            <InputField
              nameKey="currentPassword"
              type="password"
              value={payload.currentPassword}
              setValue={setPayload}
              placeholder="Enter current password"
            />
          </div>

          {/* Trường nhập mật khẩu mới */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <InputField
              nameKey="newPassword"
              type="password"
              value={payload.newPassword}
              setValue={setPayload}
              placeholder="Enter new password"
            />
          </div>

          {/* Trường nhập lại mật khẩu mới */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Confirm New Password
            </label>
            <InputField
              nameKey="confirmPassword"
              type="password"
              value={payload.confirmPassword}
              setValue={setPayload}
              placeholder="Re-enter new password"
            />
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Nút đổi mật khẩu */}
          <Button
            name={isLoading ? "Changing..." : "Change Password"}
            rounded
            handleClick={handleChangePassword}
            disabled={isLoading || isDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

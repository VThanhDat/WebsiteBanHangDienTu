const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
  generateRegisterToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const User = require("../models/user.model");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !password || !firstName || !lastName || !phone)
    return res.status(400).json({
      success: false,
      mes: "Missing input(s)",
    });

  const existedUsers = await Promise.all([
    User.findOne({ email }),
    User.findOne({ phone }),
  ]);

  if (existedUsers[0]) {
    throw new Error("Email is existed!");
  } else if (existedUsers[1]) {
    throw new Error("Phone is existed!");
  } else {
    const registerToken = generateRegisterToken(
      email,
      password,
      firstName,
      lastName,
      phone
    );
    const html = `Click on the link below to complete your registration.
        <a href=${process.env.URL_SERVER}/api/auth/authregister/${registerToken}>Click Here</a>.
        This link will be expired after 15 minutes`;
    sendMail({
      email,
      html,
      subject: "Complete registration on Digital World",
    });
    return res.status(200).json({
      success: true,
      mes: "Please check your email to active your account",
    });
  }
});

const authRegister = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email, password, firstName, lastName, phone } = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decode) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL}/authregister/failed`);
      } else {
        return decode;
      }
    }
  );
  const newUser = await User.create({
    email,
    password,
    phone,
    firstName,
    lastName,
  });
  if (newUser) {
    return res.redirect(`${process.env.CLIENT_URL}/authregister/success`);
  } else {
    return res.redirect(`${process.env.CLIENT_URL}/authregister/failed}`);
  }
});

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      sucess: false,
      mes: "Missing inputs",
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // Tách password và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // Tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // Lưu refresh token vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id })
    .select("-password -refreshToken -role")
    .populate("wishlist cart.product");
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User is not found",
  });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});
// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Click on the link below to change your password. <a href=${process.env.CLIENT_URL}/resetpassword/${resetToken}>Click Here</a>. This link will be expired after 15 minutes`;
  const data = {
    email,
    html,
    subject: "Forgot password",
  };
  const rs = sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing imputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  authRegister,
};

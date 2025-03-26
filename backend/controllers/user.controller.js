const User = require("../models/user.model");
const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const { arraysEqual } = require("../utils/helper");

const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  // Format operator Mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formattedQueries = JSON.parse(queryString);
  //Filtering
  if (queries?.firstName)
    formattedQueries.firstName = {
      $regex: queries.firstName,
      $options: "i",
    };
  if (queries?.lastName)
    formattedQueries.lastName = {
      $regex: queries.lastName,
      $options: "i",
    };
  if (queries?.email)
    formattedQueries.email = {
      $regex: queries.email,
      $options: "i",
    };
  if (queries?.phone)
    formattedQueries.phone = {
      $regex: queries.phone,
      $options: "i",
    };
  let queryCommand = User.find(formattedQueries);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand.sort(sortBy);
  }
  //Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand.select(fields);
  }
  //Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  //Execute query
  queryCommand
    .skip(skip)
    .limit(limit)
    .select("-password -refreshToken")
    .exec()
    .then(async (response) => {
      const counts = await User.find(formattedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        users: response ? response : "Can not get users.",
      });
    });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const deleteManyUsers = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  const deletedUser = await User.deleteMany({ _id: { $in: _ids } });
  return res.status(200).json({
    success: deletedUser ? true : false,
    deletedUser: deletedUser ? deletedUser : "Can not delete users",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, phone, password } = req.body;
  const response = await User.findByIdAndUpdate(
    _id,
    { firstName, lastName, phone, password },
    {
      new: true,
    }
  ).select("-password");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");

  // Chỉ admin mới có quyền chỉnh sửa role
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, mes: "Permission denied" });
  }

  const user = await User.findById(uid);
  if (!user) throw new Error("User not found");

  // Ngăn hạ cấp từ admin xuống user
  if (user.role === "admin" && req.body.role === "user") {
    return res
      .status(403)
      .json({ success: false, mes: "Cannot downgrade an admin to user" });
  }

  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Something went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { address, removedAddresses } = req.body;

  if (!Array.isArray(address)) throw new Error("Invalid address format");

  const user = await User.findById(_id);
  if (!user) throw new Error("User not found");

  // Nếu có địa chỉ bị xóa, thực hiện $pull trước
  if (Array.isArray(removedAddresses) && removedAddresses.length > 0) {
    await User.findByIdAndUpdate(
      _id,
      { $pull: { address: { $in: removedAddresses } } },
      { new: true }
    );
  }

  // Sau đó cập nhật danh sách address mới (tránh xung đột)
  const response = await User.findByIdAndUpdate(
    _id,
    { $set: { address } },
    { new: true }
  ).select("-password -refreshToken -role");

  return res.status(200).json({
    success: !!response,
    updatedUser: response || "No user address updated",
  });
});

// Update cart
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, variant } = req.body;
  if (!pid || !quantity) throw new Error("Missing input(s)");
  let variantNoId;
  if (!variant?.length) {
    const product = await Product.findById(pid).select("variants");
    const defautVariant = product.variants?.map(({ label, variants }) => ({
      label,
      variant: variants[0].variant,
    }));
    variantNoId = defautVariant;
  } else {
    variantNoId = variant.map(({ label, variant }) => ({
      label,
      variant,
    }));
  }

  const user = await User.findById(_id).select("cart").populate("cart");

  const alreadyProductVariantInCart = user?.cart?.find((item) => {
    return (
      item.product.toString() === pid &&
      arraysEqual(
        variantNoId,
        item.variant.map(({ label, variant }) => ({
          label,
          variant,
        }))
      )
    );
  });

  if (alreadyProductVariantInCart) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProductVariantInCart } },
      { $set: { "cart.$.quantity": quantity } },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: { product: pid, quantity, variant: variantNoId },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  }
});

// clear cart
const clearCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cids } = req.body;
  const user = await User.findByIdAndUpdate(_id, {
    $pull: { cart: { _id: { $in: cids } } },
  });

  return res.status(200).json({
    success: user ? true : false,
  });
});

// Remove From Cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (user?.cart?.find((el) => el._id.toString() === req.body.cid)) {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { cart: { _id: req.body.cid } } },
      {
        new: true,
      }
    ).select("-password -refreshToken -role");
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  } else {
    throw new Error("Do not found this item in cart");
  }
});

// Upload image Category
const uploadAvatar = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!req.file) return res.status(400).json({ mes: "Missing input(s)" });

  // Tìm user hiện tại để xóa ảnh cũ
  const user = await User.findById(uid);
  if (!user) return res.status(404).json({ mes: "User not found" });

  // Nếu user đã có avatar trước đó => Xóa ảnh cũ trên Cloudinary
  if (user.avatar) {
    try {
      const publicId = user.avatar.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting old avatar:", error);
    }
  }

  // Cập nhật avatar mới
  user.avatar = req.file.path;
  await user.save();

  return res.status(200).json({
    status: true,
    updatedAvatar: user.avatar,
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ mes: "Missing inputs!" });
  }

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ mes: "User does not exist!" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ mes: "Old password is incorrect!" });
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({ mes: "Password changed successfully!" });
});

const updateWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (!user?.wishlist?.find((el) => el.toString() === req.body.wid)) {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          wishlist: req.body.wid,
        },
      },
      { new: true }
    ).select("-password -refreshToken -role");
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  } else {
    return res.status(200).json({ success: true, user });
  }
});

const removeWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (user?.wishlist?.find((el) => el.toString() === req.body.wid)) {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: req.body.wid } },
      {
        new: true,
      }
    ).select("-password -refreshToken -role");
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Something went wrong",
    });
  } else {
    throw new Error("Do not found this item on wishlist");
  }
});

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  clearCart,
  removeFromCart,
  deleteManyUsers,
  uploadAvatar,
  changePassword,
  updateWishList,
  removeWishList,
};

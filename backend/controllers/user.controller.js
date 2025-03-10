const User = require("../models/user.model");
const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");

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
  if (!req.body.address) throw new Error("Missing input(s)");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  ).select("-password -refreshToken -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "No user address updated",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing input(s)");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
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
            cart: { product: pid, quantity, color },
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: { product: pid, quantity, color },
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

const createUserAddress = asyncHandler(async (req, res) => {});

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  deleteManyUsers,
};

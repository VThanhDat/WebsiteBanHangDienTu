const Order = require("../models/order.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

// Create a new blog
const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userCart = await User.findById(_id).select("cart");

  return res.status(200).json({
    success: userCart ? true : false,
    rs: userCart ? userCart : "Can not create new order",
  });
});

module.exports = {
  createOrder,
};

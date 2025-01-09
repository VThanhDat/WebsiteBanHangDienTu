const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing inputs");
  const response = await Coupon.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create new Coupon",
  });
});

// Get a single category by ID
const getCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const response = await Coupon.findById(cpid);

  return res.status(200).json({
    success: response ? true : false,
    productCoupon: response
      ? response
      : `Cannot find product Coupon with ID: ${cpid}`,
  });
});

// Get all categories
const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("title _id");

  return res.status(200).json({
    success: response ? true : false,
    productCoupons: response?.length ? response : "No product Coupons found",
  });
});

// Update a category by ID
const updateCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const response = await Coupon.findByIdAndUpdate(cpid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedProductCategory: response
      ? response
      : `Cannot update product Coupon with ID: ${cpid}`,
  });
});

// Delete a category by ID
const deleteCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const response = await Coupon.findByIdAndDelete(cpid);

  return res.status(200).json({
    success: response ? true : false,
    deletedProductCoupon: response ? response : `Cannot delete product Coupon`,
  });
});

module.exports = {
  createNewCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};

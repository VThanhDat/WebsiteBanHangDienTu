const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing inputs");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create new coupon",
  });
});

// Get a single category by ID
const getCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const response = await Coupon.findById(cpid);

  return res.status(200).json({
    success: response ? true : false,
    Coupon: response ? response : `Cannot find coupon with ID: ${cpid}`,
  });
});

// Get all categories
const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");

  return res.status(200).json({
    success: response ? true : false,
    Coupons: response?.length ? response : "No coupons found",
  });
});

// Update a category by ID
const updateCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cpid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedCoupon: response
      ? response
      : `Cannot update Coupon with ID: ${cpid}`,
  });
});

// Delete a category by ID
const deleteCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const response = await Coupon.findByIdAndDelete(cpid);

  return res.status(200).json({
    success: response ? true : false,
    deletedCoupon: response ? response : `Cannot delete Coupon`,
  });
});

module.exports = {
  createNewCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};

const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createNewCoupon = asyncHandler(async (req, res) => {
  const { title, discount, expiry } = req.body;
  if (!title || !discount || !expiry) throw new Error("Missing inputs");
  if (discount > 100) throw new Error("Discount cannot be over 100");

  const parsedExpiry = new Date(expiry);
  if (isNaN(parsedExpiry.getTime())) {
    throw new Error("Date is invalid");
  }

  req.body.expiry = parsedExpiry;
  const response = await Coupon.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create new coupon",
  });
});

// Get all categories
const getCoupons = asyncHandler(async (req, res) => {
  const { title } = req.query;
  let matchStage = {}; // Mặc định không lọc theo title

  if (title) {
    matchStage = {
      title: { $regex: title, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    };
  }

  const response = await Coupon.aggregate([
    { $match: matchStage }, // Lọc nếu có title
    {
      $project: {
        _id: 1,
        title: 1,
        discount: 1,
        expiry: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { createdAt: -1 } }, // Sắp xếp theo ngày tạo mới nhất
  ]);

  return res.status(200).json({
    success: response.length > 0,
    coupons: response.length ? response : "No coupons found",
  });
});

// Update a category by ID
const updateCoupon = asyncHandler(async (req, res) => {
  const { cpid } = req.params;
  const { title, discount, expiry } = req.body;
  if (!title || !discount || !expiry) throw new Error("Missing inputs");
  if (discount > 100) throw new Error("Discount cannot be over 100");

  const parsedExpiry = new Date(expiry);
  if (isNaN(parsedExpiry.getTime()) || parsedExpiry < Date.now()) {
    throw new Error("Date is invalid");
  }

  req.body.expiry = parsedExpiry;
  const response = await Coupon.findByIdAndUpdate(cpid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedCoupon: response ? response : `Cannot update Coupon`,
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

const deleteManyCoupons = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  const deleteCoupon = await Coupon.deleteMany({ _id: { $in: _ids } });
  return res.status(200).json({
    success: deleteCoupon ? true : false,
    deleteCoupon: deleteCoupon ? deleteCoupon : "Can not delete brands",
  });
});

module.exports = {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  deleteManyCoupons,
};

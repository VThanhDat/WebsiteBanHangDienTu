const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createNewBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBrand: response ? response : "Cannot create new brand",
  });
});

// Get a single category by ID
const getBrand = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findById(bcid);

  return res.status(200).json({
    success: response ? true : false,
    productBrand: response
      ? response
      : `Cannot find product brand with ID: ${bcid}`,
  });
});

// Get all categories
const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find().select("title _id");

  return res.status(200).json({
    success: response ? true : false,
    productBrands: response?.length ? response : "No product brands found",
  });
});

// Update a category by ID
const updateBrand = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedProductCategory: response
      ? response
      : `Cannot update product brand with ID: ${bcid}`,
  });
});

// Delete a category by ID
const deleteBrand = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findByIdAndDelete(bcid);

  return res.status(200).json({
    success: response ? true : false,
    deletedProductBrand: response ? response : `Cannot delete product brand`,
  });
});

module.exports = {
  createNewBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};

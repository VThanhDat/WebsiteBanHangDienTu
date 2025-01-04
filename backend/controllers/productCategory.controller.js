const ProductCategory = require("../models/productCategory.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdProductCategory: response
      ? response
      : "Cannot create new product category",
  });
});

// Get a single category by ID
const getCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findById(cid);

  return res.status(200).json({
    success: response ? true : false,
    productCategory: response
      ? response
      : `Cannot find product category with ID: ${cid}`,
  });
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select("title _id");

  return res.status(200).json({
    success: response ? true : false,
    productCategories: response?.length
      ? response
      : "No product categories found",
  });
});

// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(cid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedProductCategory: response
      ? response
      : `Cannot update product category with ID: ${cid}`,
  });
});

// Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(cid);

  return res.status(200).json({
    success: response ? true : false,
    deletedProductCategory: response
      ? response
      : `Cannot delete product category`,
  });
});

module.exports = {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

const BlogCategory = require("../models/blogCategory.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const response = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBlogCategory: response
      ? response
      : "Cannot create new blog category",
  });
});

// Get a single category by ID
const getCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await BlogCategory.findById(cid);

  return res.status(200).json({
    success: response ? true : false,
    BlogCategory: response
      ? response
      : `Cannot find blog category with ID: ${cid}`,
  });
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select("title _id");

  return res.status(200).json({
    success: response ? true : false,
    blogCategories: response?.length ? response : "No blog categories found",
  });
});

// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(cid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedBlogCategory: response
      ? response
      : `Cannot update blog category with ID: ${cid}`,
  });
});

// Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(cid);

  return res.status(200).json({
    success: response ? true : false,
    deletedBlogCategory: response ? response : `Cannot delete blog category`,
  });
});

module.exports = {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

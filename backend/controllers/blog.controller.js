const Blog = require("../models/blog.model");
const asyncHandler = require("express-async-handler");

// Create a new blog
const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing inputs");
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBlog: response ? response : "Cannot create new blog",
  });
});

// Get a single blog by ID
const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;

  // Tăng số lượt xem và tìm blog theo ID
  const blog = await Blog.findOneAndUpdate(
    { _id: bid }, // Điều kiện tìm blog theo ID
    { $inc: { numberViews: 1 } }, // Tăng số lượt xem
    { new: true } // Trả về blog sau khi được cập nhật
  )
    .populate("likes", "firstname lastname")
    .populate("dislikes", "firstname lastname");

  return res.status(200).json({
    success: blog ? true : false,
    rs: blog,
  });
});

// Get all blogs
const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: true,
    blogs: response,
  });
});

// Update a blog by ID
const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const updatedData = req.body;
  const response = await Blog.findByIdAndUpdate(bid, updatedData, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedBlog: response ? response : "Cannot update new blog",
  });
});

// Delete a blog by ID
const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!bid) throw new Error("Missing blog ID");
  const response = await Blog.findByIdAndDelete(bid);
  return res.status(200).json({
    success: response ? true : false,
    deletedBlog: response ? response : "Cannot delete blog",
  });
});

//LIKE
//DISLIKE

/*
Khi người dùng like một bài blog thì:
1. Check xem người đó trước đó có dislike hay không => bỏ dislike
2. Check xem người đó trước đó có like hay không => bỏ like / thêm like
*/
// pull
// push
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user; // ID của user, không cần admin
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({ success: response ? true : false, rs: response });
  }

  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({ success: true, rs: response });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({ success: true, rs: response });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user; // ID của user
  const { bid } = req.params; // Blog ID từ body request

  // Kiểm tra input
  if (!bid) throw new Error("Missing inputs");

  // Tìm blog
  const blog = await Blog.findById(bid);
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found" });
  }

  // Kiểm tra nếu user đã like blog này
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    // Nếu user đã like, xóa like
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({ success: true, rs: response });
  }

  // Kiểm tra nếu user đã dislike blog này
  const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisliked) {
    // Nếu user đã dislike, xóa dislike
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({ success: true, rs: response });
  } else {
    // Nếu chưa dislike, thêm dislike
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({ success: true, rs: response });
  }
});

const uploadImageBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing input(s)");
  const response = await Blog.findByIdAndUpdate(
    bid,
    {
      $push: { images: req.file.path },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Can not upload image blog",
  });
});

module.exports = {
  createNewBlog,
  getBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImageBlog,
};

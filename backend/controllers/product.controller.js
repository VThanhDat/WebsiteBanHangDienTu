const Product = require("../models/product.model");
const ProductCategory = require("../models/productCategory.model");
const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug })
    .populate("brand")
    .populate("category")
    .populate({
      path: "ratings.postedBy",
      select: "firstName lastName -_id",
    });
  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : "Not found product.",
  });
});

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  const { brand, category, ...queries } = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  if (!queries?.price) queries.price = { gt: 0 };
  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formattedQueries = JSON.parse(queryString);

  //Filtering
  if (queries?.title)
    formattedQueries.title = { $regex: queries.title, $options: "i" };

  let queryCommand = Product.find(formattedQueries);

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
  // limit: số object lấy về 1 gọi API
  // skip: 2
  // 1 2 3 .... 10
  // +2 => 2
  // +dsdsad => NaN
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;

  //Execute query
  if (category && brand) {
    ProductCategory.findOne({ title: { $regex: category, $options: "i" } })
      .exec()
      .then(async (category) => {
        const brandMacthed = await Brand.findOne({
          title: { $regex: brand, $options: "i" },
        });

        queryCommand
          .find({ category: category?._id, brand: brandMacthed?._id })
          .skip(skip)
          .limit(limit)
          .populate("brand")
          .populate("category")
          .exec()
          .then(async (products) => {
            const counts = await Product.find({
              category: category?._id,
            }).countDocuments();
            return res.status(200).json({
              success: products ? true : false,
              counts,
              products: products ? products : "Can not get products.",
            });
          });
      });
  } else if (category) {
    ProductCategory.findOne({ title: { $regex: category, $options: "i" } })
      .exec()
      .then((category) => {
        queryCommand
          .find({ category: category?._id })
          .skip(skip)
          .limit(limit)
          .populate("brand")
          .populate("category")
          .exec()
          .then(async (products) => {
            const counts = await Product.find({
              category: category?._id,
            }).countDocuments();
            return res.status(200).json({
              success: products ? true : false,
              counts,
              products: products ? products : "Can not get products.",
            });
          });
      });
  } else if (brand) {
    Brand.findOne({ title: { $regex: brand, $options: "i" } })
      .exec()
      .then((brand) => {
        queryCommand
          .find({ brand: brand?._id })
          .skip(skip)
          .limit(limit)
          .populate("brand")
          .populate("category")
          .exec()
          .then(async (products) => {
            const counts = await Product.find({
              brand: brand?._id,
            }).countDocuments();
            return res.status(200).json({
              success: products ? true : false,
              counts,
              products: products ? products : "Can not get products.",
            });
          });
      });
  } else {
    queryCommand.skip(skip).limit(limit);

    queryCommand
      .populate("category")
      .populate("brand")
      .exec()
      .then(async (response) => {
        const counts = await Product.find(formattedQueries).countDocuments();

        return res.status(200).json({
          success: response ? true : false,
          counts,
          products: response ? response : "Can not get products.",
        });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, err: err.message });
      });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing input");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRating) {
    // Update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // Sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;

  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + el.star,
    0
  );
  // Update the product's average rating
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();

  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing input(s)");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Can not upload images product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProduct,
};

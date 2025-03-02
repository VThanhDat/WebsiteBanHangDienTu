const Product = require("../models/product.model");
const ProductCategory = require("../models/productCategory.model");
const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const {
  getDifferentElementsFromArrays,
  arraysEqual,
} = require("../utils/helper");
const { promises } = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const { variants } = req.body;

  // Check total of variant wether on not equal
  const quantitiesEachVariant = variants.map((el) =>
    el.variants.reduce((total, el) => total + el.quantity, 0)
  );
  if (!quantitiesEachVariant?.every((el) => el === quantitiesEachVariant[0])) {
    throw new Error("Total of variants have to be equal");
  }
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
      select: "firstName lastName -_id avatar",
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
  if (req.body && req.body.title) {
    if (!req.body?.slug) req.body.slug = slugify(req.body.title);
  }

  //Check total of variant wether on not equal
  const { variants } = req.body;
  const quantitiesEachVariant = variants.map((el) =>
    el.variants.reduce((total, el) => (total += el.quantity), 0)
  );
  if (!quantitiesEachVariant?.every((el) => el === quantitiesEachVariant[0]))
    throw new Error("Total of variants have to be equal");
  const quantity = Math.max(...quantitiesEachVariant);
  if (quantity) req.body.quantity = +quantity;

  const beforeUpdated = await Product.findById(pid);
  let updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });

  if (updatedProduct) {
    const pendingRemoveFromCloudImgs = getDifferentElementsFromArrays(
      beforeUpdated.images,
      updatedProduct.images
    );
    if (pendingRemoveFromCloudImgs.length) {
      // Khai báo biến cục bộ thay vì gán vào promises
      const deletePromises = pendingRemoveFromCloudImgs?.map((imageURL) => {
        return cloudinary.uploader.destroy(
          imageURL.split("/").slice(-2).join("/").split(".")[0]
        );
      });
      await Promise.all(deletePromises);
    } else {
      if (arraysEqual(beforeUpdated.images, updatedProduct.images)) {
        updatedProduct = await Product.findByIdAndUpdate(
          pid,
          { thumb: updatedProduct.images[0] },
          {
            new: true,
          }
        );
      }
    }
  }
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updateProduct: updatedProduct ? updatedProduct : "Something went wrong",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deleteProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

const deleteManyProducts = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  const deleteProduct = await Product.deleteMany({ _id: { $in: _ids } });
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? deleteProduct : "Cannot delete products",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
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
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
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

const getAllRatings = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format operator Mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  let formattedQueries = JSON.parse(queryString);

  //Filtering
  if (queries?.title)
    formattedQueries.title = { $regex: queries.title, $options: "i" };

  if (queries?.ratings?._id)
    formattedQueries = { "ratings._id": queries?.ratings?._id };
  if (queries?.ratings?.star)
    formattedQueries = { "ratings.star": queries?.ratings?.star };
  if (queries?.ratings?.postedBy)
    formattedQueries = { "ratings.postedBy": queries?.ratings?.postedBy };

  let queryCommand = Product.find({
    $and: [{ ratings: { $exists: true, $ne: [] } }, formattedQueries],
  });

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
  queryCommand.skip(skip).limit(limit);

  queryCommand
    .populate({ path: "ratings.postedBy", select: "firstName lastName" })
    .select("_id title ratings.star ratings._id ratings.comment")
    .exec()
    .then(async (response) => {
      const counts = await Product.countDocuments({
        $and: [{ ratings: { $exists: true, $ne: [] } }, formattedQueries],
      });

      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : "Can not get product ratings.",
      });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, err: err.message });
    });
});

const deleleProductRating = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { rid } = req.body;
  const deleteProductRating = await Product.findByIdAndUpdate(
    pid,
    {
      $pull: {
        ratings: {
          _id: rid,
        },
      },
    },
    { new: true }
  );

  return res.status(200).json({
    success: deleteProductRating ? true : false,
    deleteProductRating: deleteProductRating
      ? deleteProductRating
      : "Can not delete product rating",
  });
});

const deleteManyProductRatings = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  if (!_ids?.length) throw new Error("Missing input (_ids)");

  // Sử dụng biến cục bộ thay vì gán vào promises
  const deletePromises = _ids.map(({ pid, rid }) =>
    Product.findByIdAndUpdate(
      pid,
      {
        $pull: {
          ratings: {
            _id: rid,
          },
        },
      },
      { new: true }
    )
  );

  const response = await Promise.all(deletePromises);
  return res.status(200).json({
    success: response ? true : false,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.file) throw new Error("Missing input(s)");
  const product = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: req.file.path },
    },
    { new: true }
  );
  let response;
  if (product && !product.thumb) {
    response = await Product.findByIdAndUpdate(
      pid,
      {
        thumb: product.images[0],
      },
      { new: true }
    );
  } else {
    response = product;
  }

  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Can not upload images ",
  });
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { imageUrl } = req.body;

  if (!pid || !imageUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Missing input(s)" });
  }

  const product = await Product.findById(pid);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const updatedImages = product.images.filter((img) => img !== imageUrl);
  if (updatedImages.length === product.images.length) {
    return res
      .status(400)
      .json({ success: false, message: "Image not found in product" });
  }

  try {
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary delete result for ${imageUrl}:`, cloudinaryResult);

    if (
      cloudinaryResult.result !== "ok" &&
      cloudinaryResult.result !== "not found"
    ) {
      throw new Error("Failed to delete image on Cloudinary");
    }

    product.images = updatedImages;
    if (product.thumb === imageUrl) {
      product.thumb = updatedImages[0] || "";
    }
    await product.save();

    return res.status(200).json({
      success: true,
      product: product ? product : "Can not delete image",
    });
  } catch (error) {
    console.error(
      `Error deleting image ${imageUrl} for product ${pid}:`,
      error
    );
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  ratings,
  getAllRatings,
  deleleProductRating,
  deleteManyProductRatings,
  uploadImageProduct,
  deleteProductImage,
};

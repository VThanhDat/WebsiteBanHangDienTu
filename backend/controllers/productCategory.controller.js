const ProductCategory = require("../models/productCategory.model");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { brand, title } = req.body;
  if (!title) throw new Error("Missing field title");
  if (!brand) throw new Error("Missing field brand");
  const response = await ProductCategory.create({
    ...req.body,
    image: req.file.path,
  });
  return res.status(200).json({
    success: response ? true : false,
    createdProdCategory: response
      ? response
      : "Cannot create new product category",
  });
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  if (req.query?.title) {
    const response = await ProductCategory.aggregate([
      {
        $match: {
          title: {
            $regex: req.query.title,
            $options: "i",
          },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          brand: {
            $map: {
              input: "$brand",
              as: "b",
              in: {
                $mergeObjects: [
                  "$$b",
                  {
                    productCount: {
                      $size: {
                        $filter: {
                          input: "$products",
                          cond: {
                            $eq: ["$$this.brand", "$$b._id"],
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "categoryProducts",
        },
      },
      {
        $addFields: {
          productCount: {
            $size: "$categoryProducts",
          },
        },
      },
      {
        $project: {
          title: 1,
          brand: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: response ? true : false,
      prodCategories: response ? response : "Can not get categories",
    });
  } else {
    const response = await ProductCategory.aggregate([
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          brand: {
            $map: {
              input: "$brand",
              as: "b",
              in: {
                $mergeObjects: [
                  "$$b",
                  {
                    productCount: {
                      $size: {
                        $filter: {
                          input: "$products",
                          cond: {
                            $eq: ["$$this.brand", "$$b._id"],
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "categoryProducts",
        },
      },
      {
        $addFields: {
          productCount: {
            $size: "$categoryProducts",
          },
        },
      },
      {
        $project: {
          title: 1,
          brand: 1,
          image: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: response ? true : false,
      prodCategories: response ? response : "Can not get categories",
    });
  }
});

// Upload image Category
const uploadImageCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  if (!req.file) throw new Error("Missing input(s)");

  const response = await ProductCategory.findByIdAndUpdate(pcid, {
    image: req.file.path,
  }).populate("brand");

  await cloudinary.uploader.destroy(
    response.image.split("/").slice(-2).join("/").split(".")[0]
  );

  if (response) updatedProdCategory = await ProductCategory.findById(pcid);

  return res.status(200).json({
    status: response ? true : false,
    updatedProdCategory: updatedProdCategory
      ? updatedProdCategory
      : "Can not upload image",
  });
});

// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedProdCategory: response
      ? response
      : response?.errors
      ? response.errors
      : "Not found this pcid in DB",
  });
});

// Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);

  if (response) {
    await cloudinary.uploader.destroy(
      response.image.split("/").slice(-2).join("/").split(".")[0]
    );
  }

  return res.status(200).json({
    success: response ? true : false,
    deletedProdCategory: response
      ? response
      : response?.errors
      ? response.errors
      : "Not found this pcid in DB",
  });
});

// Delete multiple categories by ID
const deleteManyCategories = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  const deletedCategories = [];
  const promiseList = _ids.map(async (cid) => {
    const deletedCategory = await ProductCategory.findByIdAndDelete(cid);
    if (deletedCategory) {
      deletedCategories.push(deletedCategory);
      return cloudinary.uploader.destroy(
        deletedCategory.image.split("/").slice(-2).join("/").split(".")[0]
      );
    }
  });
  const isSuccess = await Promise.all(promiseList);

  return res.status(200).json({
    success: isSuccess ? true : false,
    deletedCategories: deletedCategories
      ? deletedCategories
      : "Can not delete categories",
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
  uploadImageCategory,
};

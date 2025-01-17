const ProductCategory = require("../models/productCategory.model");
const asyncHandler = require("express-async-handler");

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdProdCategory: response
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
    prodCategory: response
      ? response
      : `Cannot find product category with ID: ${cid}`,
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
// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(cid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedProdCategory: response
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
    deletedProdCategory: response ? response : `Cannot delete product category`,
  });
});

module.exports = {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

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

// Get all categories
const getBrands = asyncHandler(async (req, res) => {
  if (req.query?.title) {
    const response = await Brand.aggregate([
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
          from: "products",
          localField: "_id",
          foreignField: "brand",
          as: "productCount",
        },
      },
      {
        $project: {
          title: 1,
          productCount: { $size: "$productCount" },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: response ? true : false,
      brands: response ? response : "Can not get brands",
    });
  } else {
    const response = await Brand.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brand",
          as: "productCount",
        },
      },
      {
        $project: {
          title: 1,
          productCount: { $size: "$productCount" },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: response ? true : false,
      brands: response ? response : "Can not get brands",
    });
  }
});

// Update a category by ID
const updateBrand = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    updatedBrand: response ? response : "Can not update brand",
  });
});

// Delete a category by ID
const deleteBrand = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findByIdAndDelete(bcid);

  return res.status(200).json({
    success: response ? true : false,
    deletedBrand: response ? response : "Can not delete brand",
  });
});

// Delete multiple brands by ID
const deleteManyBrands = asyncHandler(async (req, res) => {
  const { _ids } = req.body;
  const response = await Brand.deleteMany({ _id: { $in: _ids } });

  return res.status(200).json({
    success: response ? true : false,
    deletedBrand: response ? response : "Can not delete brands",
  });
});

module.exports = {
  createNewBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  deleteManyBrands,
};

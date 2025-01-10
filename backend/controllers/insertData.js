const Product = require("../models/product.model");
const ProductCategory = require("../models/productCategory.model");
const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");
const dataProduct = require("../../data/product.json");
const categoryData = require("../../data/cate_brand");
const brandData = require("../../data/brand");
const slugify = require("slugify");

const createProduct = async (product) => {
  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + "_" + Math.round(Math.random() * 100000),
    description: product?.description,
    brand: product?.brand,
    thumb: product?.thumb,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    quantity: Math.max(
      ...product.variants.map((el) =>
        el.variants.reduce((total, el) => (total += el.quantity), 0)
      )
    ),
    category: product?.category,
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    variants: product?.variants,
    totalRatings: Math.ceil(Math.random() * 5),
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  const brands = await Brand.find();
  const productCategories = await ProductCategory.find();

  const formattedDataProduct = dataProduct?.map((product) => {
    const BrandMatch = brands?.find(
      (brand) => brand?.title.toLowerCase() === product.brand.toLowerCase()
    );
    const ProductCategoryMatch = productCategories?.find(
      (cate) =>
        cate?.title.toLowerCase() === product?.category[1]?.toLowerCase()
    );
    return {
      ...product,
      variants: product.variants.map((el) => ({
        label: el.label,
        variants: el.variants.map((el) => ({
          variant: el,
          quantity: 10,
        })),
      })),
      brand: BrandMatch?._id,
      category: ProductCategoryMatch?._id,
    };
  });

  for (let product of formattedDataProduct)
    promises.push(createProduct(product));
  await Promise.all(promises);

  return res.status(200).json({
    success: true,
  });
});

const createCate = async (category) => {
  await ProductCategory.create({
    title: category?.cate,
    brand: category?.brand,
    image: category?.image,
  });
};

const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  const brands = await Brand.find();

  const formattedCategoryData = categoryData?.map((cate) => {
    return {
      ...cate,
      brand: cate?.brand?.map((title) => {
        const brandMatch = brands.find(
          (brand) => brand?.title.toLowerCase() === title.toLowerCase()
        );
        return brandMatch._id;
      }),
    };
  });
  for (let productCategory of formattedCategoryData)
    promises.push(createCate(productCategory));
  await Promise.all(promises);

  return res.status(200).json({
    success: true,
  });
});

const createBrand = async (brand) => {
  await Brand.create({
    title: brand,
  });
};

const insertBrand = asyncHandler(async (req, res) => {
  const promises = [];
  for (let brand of brandData) promises.push(createBrand(brand));
  await Promise.all(promises);

  return res.status(200).json({
    success: true,
  });
});

module.exports = {
  insertProduct,
  insertCategory,
  insertBrand,
};

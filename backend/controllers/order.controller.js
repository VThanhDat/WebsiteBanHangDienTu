const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon, phone, address, products } = req.body;
  if (!phone || !address || !products || !products.length)
    throw new Error("Missing input(s)");
  let selectedCoupon;

  if (coupon) {
    selectedCoupon = await Coupon.findById(coupon);

    if (!selectedCoupon) throw new Error("Coupon does not exist");
  }

  let total = products.reduce(
    (sum, item) => +item.product.price * +item.quantity + sum,
    0
  );

  const shippingFee = Math.round(total * 0.02);

  const createData = {
    products,
    total,
    phone,
    address,
    orderBy: _id,
  };
  if (coupon) {
    total =
      total - Math.round((total * +selectedCoupon?.discount) / 100) || total;
    createData.coupon = coupon;
  }

  total = total + shippingFee;
  createData.total = total;

  const rs = await Order.create(createData);
  //Update Product Quantity
  if (rs) {
    promises = products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const variant = el?.variant;
      const product = await Product.findById(pid);
      for (variantItem of variant)
        product.variants
          .find(
            (el) => el.label.toLowerCase() === variantItem.label.toLowerCase()
          )
          .variants.find(
            (el) =>
              el.variant.toLowerCase() === variantItem.variant.toLowerCase()
          ).quantity -= quantity;
      return product.save();
    });
    await Promise.all(promises);
  }

  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "Can not create new order",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  if (response && response?.status === "Cancelled") {
    promises = response.products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const variant = el?.variant;
      const product = await Product.findById(pid);
      for (variantItem of variant)
        product.variants
          .find(
            (el) => el.label.toLowerCase() === variantItem.label.toLowerCase()
          )
          .variants.find(
            (el) =>
              el.variant.toLowerCase() === variantItem.variant.toLowerCase()
          ).quantity += quantity;
      return product.save();
    });
    Promise.all(promises);
  }

  if (response && response?.status === "Success") {
    promises = response.products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const product = await Product.findById(pid);
      product.sold += +quantity;
      return product.save();
    });
    Promise.all(promises);
  }

  return res.status(200).json({
    success: response ? true : false,
    rs: response ? response : "Can not update status",
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  let queries = { orderBy: _id };
  const { status } = req.query;
  if (status) queries = { status, orderBy: _id };
  const response = await Order.find(queries)
    .populate("coupon")
    .populate({
      path: "products.product",
      populate: {
        path: "ratings.postedBy",
        match: { _id },
        select: "_id",
      },
    })
    .select("-orderBy")
    .sort("-updatedAt");

  return res.status(200).json({
    success: response ? true : false,
    userOrders: response ? response : "Can not get user orders",
  });
});

const userCancelOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oid } = req.params;
  if (!oid) throw new Error("Missing order id");
  const cancelOrder = await Order.findById(oid);
  // if (!cancelOrder || cancelOrder?.status !== "Processing")
  //     throw new Error("Can not cancel order");
  queries = { _id: oid, orderBy: _id };
  const response = await Order.findOneAndUpdate(
    queries,
    { status: "Cancelled" },
    { new: true }
  )
    .populate("coupon")
    .populate("products.product")
    .select("-orderBy");

  if (response) {
    promises = response.products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const variant = el?.variant;
      const product = await Product.findById(pid);
      for (variantItem of variant)
        product.variants
          .find(
            (el) => el.label.toLowerCase() === variantItem.label.toLowerCase()
          )
          .variants.find(
            (el) =>
              el.variant.toLowerCase() === variantItem.variant.toLowerCase()
          ).quantity += quantity;
      return product.save();
    });
    Promise.all(promises);
  }
  return res.status(200).json({
    success: response ? true : false,
    userOrders: response ? response : "Can not update status",
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  // Format operator Mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formattedQueries = JSON.parse(queryString);
  //Filtering
  if (queries?.coupon) {
    const selectedCoupon = await Coupon.find({
      title: { $regex: queries.coupon, $options: "i" },
    }).select("_id");
    if (selectedCoupon) {
      formattedQueries.coupon = selectedCoupon;
    }
  }
  if (queries?.email) {
    const selectedUser = await User.find({
      email: { $regex: queries.email, $options: "i" },
    }).select("_id");
    if (selectedUser) {
      formattedQueries.orderBy = selectedUser;
    }
    formattedQueries.email = undefined;
  }

  if (queries?.phone) {
    const selectedUser = await User.find({
      phone: { $regex: queries.phone, $options: "i" },
    }).select("_id");
    if (selectedUser) {
      formattedQueries.orderBy = selectedUser;
    }
    formattedQueries.phone = undefined;
  }

  if (queries?.status)
    formattedQueries.status = {
      $regex: queries.status,
      $options: "i",
    };
  let queryCommand = Order.find(formattedQueries);
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
  queryCommand
    .skip(skip)
    .limit(limit)
    .populate("products.product")
    .populate("coupon")
    .populate("orderBy")
    .select(
      "Orderby.firstName Orderby.lastName Orderby.email products phone address status coupon _id, createdAt"
    )
    .exec()
    .then(async (response) => {
      const counts = await Order.find(formattedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response ? response : "Can not get products.",
      });
    });
});

module.exports = {
  createOrder,
  updateStatus,
  getUserOrders,
  userCancelOrders,
  getOrders,
};

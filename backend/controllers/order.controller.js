const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const { createMomoPayment } = require("../utils/paymentMoMo");

const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon, phone, address, products, paymentMethod } = req.body;

  if (!phone || !address || !products || !products.length || !paymentMethod)
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

  if (coupon) {
    total =
      total - Math.round((total * +selectedCoupon?.discount) / 100) || total;
  }

  total = total + shippingFee;

  if (paymentMethod === "cod") {
    const createData = {
      products,
      total,
      phone,
      address,
      orderBy: _id,
      paymentMethod,
      status: "Pending",
    };

    if (coupon) createData.coupon = coupon;

    const rs = await Order.create(createData);

    if (rs) {
      const updatePromises = products.map(async (el) => {
        const pid = el?.product._id;
        const quantity = el?.quantity;
        const variant = el?.variant;
        const product = await Product.findById(pid);

        for (const variantItem of variant) {
          product.variants
            .find(
              (el) => el.label.toLowerCase() === variantItem.label.toLowerCase()
            )
            .variants.find(
              (el) =>
                el.variant.toLowerCase() === variantItem.variant.toLowerCase()
            ).quantity -= quantity;
        }
        return product.save();
      });

      await Promise.all(updatePromises);
    }

    return res.status(200).json({ success: !!rs, rs });
  } else if (paymentMethod === "momo") {
    // 🔹 Tạo đơn hàng với trạng thái "Pending"
    const order = await Order.create({
      products,
      total,
      phone,
      address,
      orderBy: _id,
      paymentMethod,
      status: "Pending",
    });

    if (coupon) {
      order.coupon = coupon;
      await order.save();
    }
    // 🔹 Trừ số lượng sản phẩm trong giỏ hàng
    const updatePromises = products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const variant = el?.variant;
      const product = await Product.findById(pid);

      for (const variantItem of variant) {
        product.variants
          .find(
            (el) => el.label.toLowerCase() === variantItem.label.toLowerCase()
          )
          .variants.find(
            (el) =>
              el.variant.toLowerCase() === variantItem.variant.toLowerCase()
          ).quantity -= quantity;
      }
      return product.save();
    });

    await Promise.all(updatePromises);

    // 🔹 Gửi yêu cầu thanh toán MoMo
    const momoResponse = await createMomoPayment(order);

    if (momoResponse.resultCode === 0) {
      // 🔹 Trả về link thanh toán MoMo cho FE để redirect người dùng
      return res.status(200).json({
        success: true,
        orderId: order._id,
        paymentUrl: momoResponse.payUrl, // FE redirect người dùng đến đây
      });
    } else {
      // Nếu thanh toán thất bại, xóa đơn hàng để tránh đơn hàng bị bỏ lại
      await Order.findByIdAndDelete(order._id);
      throw new Error("Can not create payment link");
    }
  }
});

const verifyMomoPayment = asyncHandler(async (req, res) => {
  const { orderId, resultCode } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }

  if (resultCode === 0) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "Paid" },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Payment successful", order });
  }

  return res.status(400).json({ success: false, message: "Payment failed" });
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

  if (queries?.paymentMethod) {
    formattedQueries.paymentMethod = {
      $regex: queries.paymentMethod,
      $options: "i",
    };
  }

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
      "Orderby.firstName Orderby.lastName Orderby.email products phone paymentMethod address status coupon  _id, createdAt"
    )
    .exec()
    .then(async (response) => {
      const counts = await Order.find(formattedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response ? response : "Can not get orders.",
      });
    });
});

const getOneOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;

  const order = await Order.findById(oid)
    .populate("products.product")
    .populate("coupon")
    .populate("orderBy")
    .select(
      "Orderby.firstName Orderby.lastName Orderby.email products phone paymentMethod address status coupon"
    );

  return res.status(200).json({
    success: order ? true : false,
    order: order ? order : "Can not get order",
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

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  let { status } = req.body;

  if (!status) throw new Error("Missing status");

  // Map "Confirm" thành "Waiting"
  if (status === "Confirm") status = "Waiting";

  // Nếu trạng thái là "Send", đổi thành "Delivering"
  if (status === "Send") status = "Delivering";

  if (status === "Success") status = "Delivered";

  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  if (response && response?.status === "Delivered") {
    const promises = response.products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const product = await Product.findById(pid);
      product.sold += +quantity;
      return product.save();
    });

    await Promise.all(promises);
  }

  return res.status(200).json({
    success: response ? true : false,
    rs: response ? response : "Can not update status",
  });
});

const userCancelOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oid } = req.params;

  if (!oid) throw new Error("Missing order id");

  const queries = { _id: oid, orderBy: _id };
  const response = await Order.findOneAndUpdate(
    queries,
    { status: "Cancelled" },
    { new: true }
  )
    .populate("coupon")
    .populate("products.product")
    .select("-orderBy");

  if (response) {
    const promises = response.products.map(async (el) => {
      const pid = el?.product._id;
      const quantity = el?.quantity;
      const variant = el?.variant;

      const product = await Product.findById(pid);
      if (!product) return;

      for (const variantItem of variant) {
        const labelGroup = product.variants.find(
          (v) => v.label?.toLowerCase() === variantItem.label?.toLowerCase()
        );

        const actualVariant = labelGroup?.variants.find(
          (v) => v.variant?.toLowerCase() === variantItem.variant?.toLowerCase()
        );

        if (actualVariant) {
          actualVariant.quantity += quantity;
        }
      }

      return product.save();
    });

    await Promise.all(promises);
  }

  return res.status(200).json({
    success: !!response,
    userOrders: response || "Can not update status",
  });
});

module.exports = {
  createOrder,
  verifyMomoPayment,
  getOrders,
  getOneOrder,
  getUserOrders,
  updateStatus,
  userCancelOrders,
};

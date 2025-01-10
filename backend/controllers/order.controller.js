const Order = require("../models/order.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

// Create a new blog
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

module.exports = {
  createOrder,
};

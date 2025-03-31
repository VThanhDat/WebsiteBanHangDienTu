const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        variant: [{ label: String, variant: String }],
      },
    ],
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Cancelled",
        "Paid",
        "Shipping",
        "Awaiting Shipment",
        "Pending",
        "Returning",
        "Delivered",
      ],
    },
    total: Number,
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    address: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);

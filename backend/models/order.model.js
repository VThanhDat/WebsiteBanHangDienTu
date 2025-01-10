const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        variant: [{ label: String, variant: String }],
        color: String,
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: [
        "Cancelled",
        "Accepted",
        "Shipping",
        "Processing",
        "Returning",
        "Success",
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
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);

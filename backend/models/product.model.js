const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: Array,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    thumb: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      require: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    variants: [
      {
        label: { type: String },
        variants: [{ variant: String, quantity: { type: Number } }],
      },
    ],
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    url_product: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();
  if (update.images && update.images.length > 0 && !update.thumb) {
    update.thumb = update.images[0];
  }
  next();
});

productSchema.pre("save", function (next) {
  let totalQuantity = Math.max(
    ...this.variants.map((el) =>
      el.variants.reduce((total, el) => (total += el.quantity), 0)
    )
  );
  this.quantity = totalQuantity;
  next();
});

//Export the model
module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

// brandSchema.virtual('productCount', {
//     ref: 'Product',
//     localField: '_id',
//     foreignField: 'brand',
//     count: true
//   });

//Export the model
module.exports = mongoose.model("Brand", brandSchema);

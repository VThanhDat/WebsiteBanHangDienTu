const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "BlogCategory",
    },
    numberViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDS9tDMO0OFyxQE4wpzCB6BjV9mCNlYeSTQZpVl45MpUytHH6JZuqg5daPtSKm1fuFd3bm2SjpsgqmPUH8qDxcWrzUUSx9oIIR3m2cvAku2tiMc32zaa7KwA9EnDEFow0x346FahTv4jV2/s1600/resize-blogger-popular-posts-thumbnail-image.png",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);

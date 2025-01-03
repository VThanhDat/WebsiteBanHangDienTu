const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected databases successfully!");
  } catch (error) {
    console.log("CONNECT ERROR!", error);
    throw new Error(error);
  }
};

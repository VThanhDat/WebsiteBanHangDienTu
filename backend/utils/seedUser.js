const mongoose = require("mongoose");
const User = require("../models/user.model"); // chỉnh đúng path
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

async function seedUsers() {
  await User.deleteMany({ email: { $in: ["admin@gmail.com", "user@gmail.com"] } });

  const admin = new User({
    firstName: "Admin",
    lastName: "System",
    email: "admin@gmail.com",
    phone: "0900000000",
    password: "admin123", // sẽ tự hash
    role: "admin",
    address: ["Hồ Chí Minh"],
  });

  const user = new User({
    firstName: "User",
    lastName: "Normal",
    email: "user@gmail.com",
    phone: "0911111111",
    password: "user123", // sẽ tự hash
    role: "user",
    address: ["TP.HCM"],
  });

  await admin.save();
  await user.save();

  console.log("Seed users success");
  process.exit();
}

seedUsers();

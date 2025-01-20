const jwt = require("jsonwebtoken");

const generateRegisterToken = (email, password, firstName, lastName, phone) => {
  return jwt.sign(
    { email, password, firstName, lastName, phone },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateRegisterToken,
};

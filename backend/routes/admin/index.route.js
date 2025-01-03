const configSystem = require("../../config/system");

const userRouter = require("./user.route");
const productRouter = require("./product.route");

module.exports = (app) => {
  const ADMIN_PATH = "/" + configSystem.adminPrefix;

  app.use(ADMIN_PATH + "/user", userRouter);
  app.use(ADMIN_PATH + "/product", productRouter);
};

const userRouter = require("./user.route");
const productRouter = require("./product.route");
const authRouter = require("./auth.route");

const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;

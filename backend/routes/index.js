const userRouter = require("./user.route");
const productRouter = require("./product.route");
const productCategoryRouter = require("./productCategory.route");
const blogCategoryRouter = require("./blogCategory.route");

const authRouter = require("./auth.route");

const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/prodcategory", productCategoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;

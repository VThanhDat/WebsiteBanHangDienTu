const authRoutes = require("./auth.route");

// const authMiddleware = require("../../middlewares/client/auth.middleware");
const { notFound, errHandler } = require("../../middlewares/errHandler");

module.exports = (app) => {
  // app.use("/api/user", authMiddleware.authRequire, authRoutes);
  app.use("/user", authRoutes);

  app.use(notFound);
  app.use(errHandler);
};

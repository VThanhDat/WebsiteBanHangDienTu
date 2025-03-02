const router = require("express").Router();
const ctrls = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../middlewares/cloudinary.product");

router.get("/", ctrls.getProducts);
router.get("/get/:slug", ctrls.getProduct);
router.put("/ratings", verifyAccessToken, ctrls.ratings);
router.get("/ratings", verifyAccessToken, isAdmin, ctrls.getAllRatings);
router.put(
  "/deleterating/:pid",
  verifyAccessToken,
  isAdmin,
  ctrls.deleleProductRating
);
router.put(
  "/deleteratings",
  verifyAccessToken,
  isAdmin,
  ctrls.deleteManyProductRatings
);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.put("/update/:pid", verifyAccessToken, isAdmin, ctrls.updateProduct);
router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.uploadImageProduct
);
router.delete("/delete/:pid", verifyAccessToken, isAdmin, ctrls.deleteProduct);
router.delete(
  "/deletemany",
  verifyAccessToken,
  isAdmin,
  ctrls.deleteManyProducts
);
router.delete(
  "/deleteimage/:pid",
  verifyAccessToken,
  isAdmin,
  ctrls.deleteProductImage
);

module.exports = router;

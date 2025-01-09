const multer = require("multer"); // dùng để upload ảnh, ...
const router = require("express").Router();
const ctrls = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getProducts);
router.put("/ratings", verifyAccessToken, ctrls.ratings);

router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.single("images"),
  ctrls.uploadImageProduct
);

router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;

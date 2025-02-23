const router = require("express").Router();
const ctrls = require("../controllers/productCategory.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../middlewares/cloudinary.category");

router.get("/", ctrls.getCategories);
router.post(
  "/",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.createCategory
);
router.put(
  "/uploadimage/:pcid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.uploadImageCategory
);
router.put("/update/:pcid", verifyAccessToken, isAdmin, ctrls.updateCategory);
router.delete(
  "/delete/:pcid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteCategory
);
router.post(
  "/deletemany",
  [verifyAccessToken, isAdmin],
  ctrls.deleteManyCategories
);

module.exports = router;

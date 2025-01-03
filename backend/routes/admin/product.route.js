const router = require("express").Router();
const ctrls = require("../../controllers/admin/product.controller");
const { verifyAccessToken, isAdmin } = require("../../middlewares/verifyToken");

// router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
// router.get("/", ctrls.getProducts);

// router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
// router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
// router.get("/:pid", ctrls.getProduct);

router.post("/", ctrls.createProduct);
router.get("/", ctrls.getProducts);

router.put("/:pid", ctrls.updateProduct);
router.delete("/:pid", ctrls.deleteProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;

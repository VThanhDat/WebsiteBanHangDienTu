const router = require("express").Router();
const ctrls = require("../controllers/brand.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewBrand);
router.get("/", ctrls.getBrands);
router.put("/:bcid", [verifyAccessToken, isAdmin], ctrls.updateBrand);
router.delete("/:bcid", [verifyAccessToken, isAdmin], ctrls.deleteBrand);
router.get("/:bcid", ctrls.getBrand);

module.exports = router;

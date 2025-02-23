const router = require("express").Router();
const ctrls = require("../controllers/brand.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getBrands);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewBrand);
router.put("/update/:bcid", [verifyAccessToken, isAdmin], ctrls.updateBrand);
router.delete(
  "/deletemany",
  [verifyAccessToken, isAdmin],
  ctrls.deleteManyBrands
);
router.delete("/delete/:bcid", [verifyAccessToken, isAdmin], ctrls.deleteBrand);

module.exports = router;

const router = require("express").Router();
const ctrls = require("../controllers/brand.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getBrands);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewBrand);
router.put("/update/:bcid", [verifyAccessToken, isAdmin], ctrls.updateBrand);
router.delete("/detele/:bcid", [verifyAccessToken, isAdmin], ctrls.deleteBrand);
router.delete(
  "/deletemany",
  [verifyAccessToken, isAdmin],
  ctrls.deleteManyBrands
);

module.exports = router;

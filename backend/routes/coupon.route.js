const router = require("express").Router();
const ctrls = require("../controllers/coupon.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getCoupons);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewCoupon);
router.put("/update/:cpid", [verifyAccessToken, isAdmin], ctrls.updateCoupon);
router.delete(
  "/delete/:cpid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteCoupon
);
router.delete(
  "/deletemany",
  verifyAccessToken,
  isAdmin,
  ctrls.deleteManyCoupons
);

module.exports = router;

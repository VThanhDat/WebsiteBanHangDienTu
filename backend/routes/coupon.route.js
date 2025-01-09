const router = require("express").Router();
const ctrls = require("../controllers/coupon.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getCoupons);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewCoupon);
router.get("/:cpid", ctrls.getCoupon);
router.put("/:cpid", [verifyAccessToken, isAdmin], ctrls.updateCoupon);
router.delete("/:cpid", [verifyAccessToken, isAdmin], ctrls.deleteCoupon);

module.exports = router;

const router = require("express").Router();
const ctrls = require("../controllers/order.controller");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.get("/", verifyAccessToken, ctrls.getUserOrders);
router.post("/momo-ipn", ctrls.verifyMomoPayment); // Xử lý IPN từ MoMo
router.get("/admin", verifyAccessToken, isAdmin, ctrls.getOrders);
router.put("/status/:oid", verifyAccessToken, isAdmin, ctrls.updateStatus);
router.put("/:oid", verifyAccessToken, ctrls.userCancelOrders);

module.exports = router;

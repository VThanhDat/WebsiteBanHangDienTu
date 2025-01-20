const router = require("express").Router();
const ctrls = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.post("/forgotpassword", ctrls.forgotPassword);
router.post("/login", ctrls.login);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/authregister/:token", ctrls.authRegister);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.get("/logout", ctrls.logout);
router.put("/resetpassword", ctrls.resetPassword);

module.exports = router;

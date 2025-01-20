const router = require("express").Router();
const ctrls = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/authregister/:token", ctrls.authRegister);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);

module.exports = router;

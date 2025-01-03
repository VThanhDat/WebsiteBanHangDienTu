const router = require("express").Router();
const controller = require("../../controllers/client/auth.controller");
const { verifyAccessToken } = require("../../middlewares/verifyToken");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/current", verifyAccessToken, controller.getCurrent);
router.post("/refreshtoken", controller.refreshAccessToken);
router.get("/logout", controller.logout);
router.get("/forgotpassword", controller.forgotPassword);
router.put("/resetpassword", controller.resetPassword);

module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs

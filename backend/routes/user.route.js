const router = require("express").Router();
const ctrls = require("../controllers/user.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../middlewares/cloudinary.user");

router.put("/cart", [verifyAccessToken], ctrls.updateCart);
router.put("/address", [verifyAccessToken], ctrls.updateUserAddress);
router.put("/current", [verifyAccessToken], ctrls.updateUser);
router.put("/change-password", [verifyAccessToken], ctrls.changePassword);
//[ADMIN]
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/delete", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.delete(
  "/deletemany",
  [verifyAccessToken, isAdmin],
  ctrls.deleteManyUsers
);
router.put(
  "/update/:uid",
  [verifyAccessToken, isAdmin],
  ctrls.updateUserByAdmin
);

router.put(
  "/uploadavatar/:uid",
  [verifyAccessToken],
  uploader.single("avatar"),
  ctrls.uploadAvatar
);

module.exports = router;

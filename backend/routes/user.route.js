const router = require("express").Router();
const ctrls = require("../controllers/user.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.put("/cart", [verifyAccessToken], ctrls.updateCart);
router.put("/address", [verifyAccessToken], ctrls.updateUserAddress);
router.put("/current", [verifyAccessToken], ctrls.updateUser);

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

module.exports = router;

const router = require("express").Router();
const ctrls = require("../controllers/blog.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../configs/cloudinary.config");

router.get("/", ctrls.getBlogs);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewBlog);
router.get("/one/:bid", ctrls.getBlog);
router.put("/like/:bid", verifyAccessToken, ctrls.likeBlog);
router.put("/dislike/:bid", verifyAccessToken, ctrls.dislikeBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);

router.put(
  "/uploadimage/:bid",
  verifyAccessToken,
  isAdmin,
  uploader.single("image"),
  ctrls.uploadImageBlog
);

module.exports = router;

const router = require("express").Router();
const ctrls = require("../controllers/blog.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createNewBlog);
router.put("/like", verifyAccessToken, ctrls.likeBlog);
router.put("/dislike", verifyAccessToken, ctrls.dislikeBlog);
router.get("/", ctrls.getBlogs);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
router.get("/:bid", ctrls.getBlog);

module.exports = router;

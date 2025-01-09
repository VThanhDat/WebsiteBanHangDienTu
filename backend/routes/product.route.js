const router = require("express").Router();
const ctrls = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer({ storage: storage });

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getProducts);
router.put("/ratings", verifyAccessToken, ctrls.ratings);

router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.single("images"),
  upload.single("images"),
  ctrls.uploadImageProduct
);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;

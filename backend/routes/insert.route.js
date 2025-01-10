const router = require("express").Router();
const ctrls = require("../controllers/insertData");

router.post("/brand", ctrls.insertBrand);
router.post("/category", ctrls.insertCategory);
router.post("/product", ctrls.insertProduct);

module.exports = router;

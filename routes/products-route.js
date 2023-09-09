const express = require("express");
const router = express.Router();
router.use("/product",require("../controllers/productController"))
module.exports = router;

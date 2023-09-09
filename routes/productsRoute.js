const express = require("express");
const router = express.Router();
router.use("/",require("../controllers/productController"))
module.exports = router;

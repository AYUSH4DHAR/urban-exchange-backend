const express = require("express");
const router = express.Router();
router.use("/", require("../controllers/ImageController"));
module.exports = router;
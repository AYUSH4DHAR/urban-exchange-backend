const express = require("express");
const router = express.Router();
router.use("/", require("../controllers/HashTagController"));
module.exports = router;
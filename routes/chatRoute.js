const express = require("express");
const router = express.Router();
router.use("/", require("../controllers/chatController"));
module.exports = router;
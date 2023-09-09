const express = require("express");
const router = express.Router();
router.use("/", require("../controllers/UserController"));
module.exports = router;
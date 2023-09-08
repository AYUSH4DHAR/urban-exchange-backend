const express = require("express");
const router = express.Router();
router.use("/users",require("../controllers/UserController"))
module.exports = router;
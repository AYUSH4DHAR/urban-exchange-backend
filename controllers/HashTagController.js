const express = require("express");
const hashRouter = express.Router();
const hashService = require('../services/HashTagService');

hashRouter.get("/search/:hash", async (req, res, next) => {
    await hashService.searchHashTag(req, res, next);
});
hashRouter.get("/top/:count", async (req, res, next) => {
    await hashService.topHashTags(req, res, next);
})
module.exports = hashRouter;
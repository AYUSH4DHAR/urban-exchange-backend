const express = require('express');
const imageRouter = express.Router();
const imageService = require('../services/ImageService');

imageRouter.post("/single", imageService.upload.single('image'), (req, res, next) => {
    res.json({
        status: "success",
        message: "image uploaded successfully"
    });
})
module.exports = imageRouter;
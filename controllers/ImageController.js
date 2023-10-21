const express = require('express');
const imageRouter = express.Router();
const imageService = require('../services/ImageService');
const fs = require('fs');
const path = require('path');

imageRouter.post("/single", imageService.upload.single('image'), (req, res, next) => {
    res.json({
        status: "success",
        message: "image uploaded successfully"
    });
})
imageRouter.get("/", (req, res, next) => {
    const imageName = req.body.imageName;
    fs.readdir(`${process.cwd()}/images`, async (err, files) => {
        if (err) {
            console.error(err);
        } else {
            let fileFound = false;
            files.forEach(file => {
                let fileName = path.basename(file, path.extname(file));
                if (imageName.includes(fileName)) {
                    fileFound = true;
                    res.sendFile(`${process.cwd()}/images/${imageName}`);
                    return;
                }
            })
            if (!fileFound) {
                res.status(404).send("File Not Found");
            }
        }
    });
})
module.exports = imageRouter;
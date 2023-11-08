const express = require('express'); 
const imageRouter = express.Router();
const imageService = require('../services/ImageService');
const fs = require('fs');
const path = require('path');
imageRouter.post("/user", imageService.upload.single('avatar'), (req, res, next) => {
    res.json({
        status: "success",
        message: "user image uploaded successfully"
    });
})

imageRouter.post("/single", imageService.upload.single('image'), (req, res, next) => {
    res.json({
        status: "success",
        message: "image uploaded successfully"
    });
})
imageRouter.post("/multiple", imageService.upload.array('images', 10), (req, res, next) => {
    res.json({
        status: "success",
        message: "product images uploaded successfully"
    })
})
imageRouter.get("/:name", (req, res, next) => {
    const imageName = req.params.name;
    let directory = `${process.cwd()}/images`;
    let imageDir = imageName.split('---')[0];
    if (imageDir == 'images') directory += '/product';
    else if (imageDir == 'avatar') directory += '/user';
    fs.readdir(directory, async (err, files) => {
        if (err) {
            console.error(err);
        } else {
            let fileFound = false;
            files.forEach(file => {
                let fileName = path.basename(file, path.extname(file));
                if (imageName.includes(fileName)) {
                    fileFound = true;
                    res.sendFile(`${directory}/${imageName}`);
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
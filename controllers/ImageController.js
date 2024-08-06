const express = require('express');
const imageRouter = express.Router();
const imageService = require('../services/ImageService');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
imageRouter.post("/user", imageService.upload.single('avatar'), (req, res, next) => {
    res.json({
        status: "success",
        message: "user image uploaded successfully"
    });
    res.on('finish', () => {
        imageService.cloudUploader.upload(req.file.path, { tags: 'user-avatar', folder: 'avatar', public_id: path.basename(req.file.filename, path.extname(req.file.filename)) }).then(response => {
            imageService.saveImage(req.file.filename, response);
        });
    })
})

imageRouter.post("/single", imageService.upload.single('image'), async (req, res, next) => {

    res.json({
        status: "success",
        message: "image saved successfully. Uploading to cloudinary.."
    });
    res.on('finish', () => {
        imageService.cloudUploader.upload(req.file.path, { tags: 'single-image', folder: 'single-images', public_id: path.basename(req.file.filename, path.extname(req.file.filename)) }).then(response => {
            imageService.saveImage(req.file.filename, response);
        });
    })
})
imageRouter.post("/multiple", imageService.upload.array('images', 10), (req, res, next) => {
    res.json({
        status: "success",
        message: "product images uploaded successfully"
    })
    res.on('finish', () => {
        req.files.forEach(file => {
            imageService.cloudUploader.upload(file.path, { tags: 'multiple-images', folder: 'product', public_id: path.basename(file.filename, path.extname(file.filename)) }).then(response => {
                imageService.saveImage(file.filename, response);
            });
        })
    })
})
imageRouter.get("/imageUrl/:name", async (req, res, next) => {
    const imageName = req.params.name;
    const imageData = await Image.findOne({ name: imageName });
    let optimizedUrl = '';
    if (imageData && imageData.secureUrl) {
        optimizedUrl = imageData.secureUrl.slice(0, -3) + 'webp';
    }
    res.json({
        message: "Success",
        data: {
            imageData,
            optimizedUrl: optimizedUrl
        }
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
            res.status(404).send("File Not Found");
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
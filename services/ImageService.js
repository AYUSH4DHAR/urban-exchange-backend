const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');
require('dotenv').config();
const crypto = require('crypto');
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
});
const fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        let curPath = `${process.cwd()}/images`;
        if (file.fieldname == 'images') curPath += '/product';
        else if (file.fieldname == 'avatar') curPath += '/user';
        else curPath += '/single';
        fs.mkdirSync(curPath, { recursive: true });
        cb(null, curPath);
    },
    filename: function (req, file, cb) {
        // name --- uniqueId --- productId
        cb(null, file.fieldname + '---' + crypto.randomBytes(16).toString("hex") + '---' + req.body.tag + path.extname(file.originalname));
    }
});
const upload = multer({ storage: fileStorageEngine });

const saveImageDetailsToDB = (filename, cloudinaryImage) => {
    const image = new Image({
        name: filename,
        secureUrl: cloudinaryImage.secure_url,
        version: cloudinaryImage.version,
        publicId: cloudinaryImage.public_id,
        signature: cloudinaryImage.signature,
        folder: cloudinaryImage.folder,
        originalFilename: cloudinaryImage.original_filename
    });
    image.save().then((result) => {
        console.log('image info saved in db');
    });
}
//TODO: use date to purge any images saved which don't have corresponding product associated
//[Dec,2023] TODO: once image is uploaded to cloud storage, remove from file storage. 
//[Dec,2023] Run a cron job to remove images folder once a day ? 
module.exports = { upload, cloudUploader: cloudinary.uploader, saveImage: saveImageDetailsToDB }
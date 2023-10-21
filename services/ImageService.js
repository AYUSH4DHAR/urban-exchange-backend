const multer = require('multer');
const path = require('path');
const fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.cwd()}/images`);
    },
    filename: function (req, file, cb) {
        // name --- uniqueId --- productId
        cb(null, file.fieldname + '---' + Date.now() + '---' + req.body.tag + path.extname(file.originalname));
    }
});
const upload = multer({ storage: fileStorageEngine });
//TODO: make it export with additional config -> for separation of storage
//TODO: use date to purge any images saved which don't have corresponding product associated
module.exports = { upload }
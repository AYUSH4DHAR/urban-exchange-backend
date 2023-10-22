const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
        cb(null, file.fieldname + '---' + Date.now() + '---' + req.body.tag + path.extname(file.originalname));
    }
});
const upload = multer({ storage: fileStorageEngine });
//TODO: make it export with additional config -> for separation of storage
//TODO: use date to purge any images saved which don't have corresponding product associated
module.exports = { upload }
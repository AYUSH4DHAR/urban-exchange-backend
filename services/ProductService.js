const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const createProduct = async (req, res, next) => {
    const productTag = req.body.tag;
    const productImages = [];
    fs.readdir(`${process.cwd()}/images`, async (err, files) => {
        if (err) {
            console.error(err);
        } else {
            files.forEach(file => {
                let fileName = path.basename(file, path.extname(file));
                let fileTag = fileName.split('---')[2];
                if (fileTag && fileTag.includes(productTag)) productImages.push(file);
            })
            req.body.productImages = productImages;
            await persistProduct(req, res, next);
        }
    });
}
const persistProduct = async (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        note: req.body.note ? req.body.note : "",
        modelNo: req.body.modelNo ? req.body.modelNo : "",
        category: req.body.category ? req.body.category : "",
        seller: req.body.seller ? req.body.seller : new ObjectId(),
        boughtBy: req.body.boughtBy ? req.body.boughtBy : new ObjectId(),
        tag: req.body.tag,
        productImages: req.body.productImages
    });
    await product.save().then((createdProduct) => {
        res.status(201).json({
            message: "Product added successfully",
            productId: createdProduct._id,
        });
    });
}
const createProductTag = async (req, res, next) => {
    const productTag = crypto.randomBytes(16).toString("hex");
    res.status(201).json({
        message: "Created product tag",
        data: productTag
    })
}
const getAllProducts = async (req, res, next) => {
    Product.find().then((products) => {
        res.status(200).json({
            message: "Products fetched successfully!",
            data: products,
        });
    });
}
const deleteProductById = async (req, res, next) => {
    Product.findOneAndDelete({ _id: req.params.id }).then((result) => {
        let productImages = result.productImages;
        fs.readdir(`${process.cwd()}/images/product`, async (err, files) => {
            if (err) {
                console.error(err);
            } else {
                files.forEach(file => {
                    let fileName = path.basename(file);
                    if (productImages.includes(fileName)) {
                        fs.unlink(`${process.cwd()}/images/${fileName}`, (err) => {
                            if (err && err.code == 'ENOENT') {
                                console.info("File doesn't exist, won't remove it.");
                            } else if (err) {
                                console.error("Error occurred while trying to remove file");
                            } else {
                                console.info(`removed`);
                            }
                        });
                    }
                })
            }
        });
        res.status(200).json({ message: "Products deleted!" });
    });
}
module.exports = {
    createProduct,
    getAllProducts,
    deleteProductById,
    createProductTag
}
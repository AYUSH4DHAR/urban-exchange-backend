const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const UserService = require('../services/UserService');
const PRODUCT_CATEGORIES = ["Books", "Electronics", "Clothing", "Vehicles", "Accessories"];
const createProduct = async (req, res, next) => {
    const productTag = req.body.tag;
    const productImages = [];
    fs.readdir(`${process.cwd()}/images/product`, async (err, files) => {
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
        boughtBy: req.body.boughtBy ? req.body.boughtBy : null,
        tag: req.body.tag,
        productImages: req.body.productImages
    });
    await product.save().then(async (createdProduct) => {
        await UserService.addToUserProductsPersist(req.body.seller, createdProduct._id).then(result => {
            res.status(201).json({
                message: "Product added successfully, User products updated",
                productId: createdProduct._id,
            });
        }, (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: null
            })
        });
    }, (error) => {
        console.error(error);
        res.status(503).json({
            message: "Product Creation Failure",
            data: null
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
const getProductById = async (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then((product) => {
        res.status(200).json({
            message: "Product fetched successfully",
            data: product
        })
    }, (error) => {
        console.error(error);
        res.status(404).json({
            message: "Product Not Found",
            data: null
        })
    })
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
    }, (error) => {
        console.error(error);
        res.status(404).json({
            message: "Product Not Found",
            data: null
        })
    });
}
const getProductCategories = async (req, res, next) => {
    res.status(200).json({
        message: "Fetched product categories",
        data: PRODUCT_CATEGORIES
    })
}
const getCreateProductFields = async (req, res, next) => {
    let createProductFields = [
        {
            label: 'name',
            fieldName: 'Product Name',
            type: 'text',
            required: true,
            multiple: false,
        },
        {
            label: 'price',
            fieldName: 'Price',
            type: 'number',
            required: true,
            multiple: false,
        },
        {
            label: 'description',
            fieldName: 'Description',
            type: 'textarea',
            required: true,
            multiple: false,
        },
        {
            label: 'note',
            fieldName: 'Note',
            type: 'textarea',
            required: false,
            multiple: false,
        },
        {
            label: 'modelNo',
            fieldName: 'Model No',
            type: 'text',
            required: true,
            multiple: false,
        },
        {
            label: 'category',
            fieldName: 'Category',
            type: 'select',
            required: true,
            multiple: false,
            options: PRODUCT_CATEGORIES,
        },
        {
            label: 'images',
            fieldName: 'Images',
            type: 'file',
            required: true,
            multiple: true,
        },
    ];
    res.status(200).json({
        message: "Fetched create product fields",
        data: createProductFields
    })
}
const getProductsByPageNoAndPageSizeAndOrCategory = async (req, res, next) => {
    // assign default page number and page size
    // require total length for pagination
    if (!req.query.page || !req.query.limit || req.query.limit && Number(req.query.limit) == 0) {
        req.query.page = req.query.page ? req.query.page : 0;
        req.query.limit = req.query.limit ? req.query.limit : 25;
    }
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    let category = req.query.category;
    let data = await Product.aggregate([
        { "$match": { category: category ? category : /./ } },
        {
            "$facet": {
                "products": [
                    { "$skip": page },
                    { "$limit": limit }
                ],
                "totalProducts": [
                    { "$count": "count" }
                ],
            }
        }
    ]);
    res.json({
        message: "successfully fetched products",
        data: data,
        page: page,
        limit: limit
    });

}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    createProductTag,
    getCreateProductFields,
    getProductCategories,
    getProductsByPageNoAndPageSizeAndOrCategory,
}
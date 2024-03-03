const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Product = require('../models/product');
const UserService = require('../services/UserService');
const PRODUCT_CATEGORIES = ["Books", "Electronics", "Clothing", "Vehicles", "Accessories"];
const STATES_INFO = [
    ["Andhra Pradesh", "AP"],
    ["Arunachal Pradesh", "AR"],
    ["Assam", "AS"],
    ["Bihar", "BR"],
    ["Chhattisgarh", "CG"],
    ["Goa", "GA"],
    ["Gujarat", "GJ"],
    ["Haryana", "HR"],
    ["Himachal Pradesh", "HP"],
    ["Jammu and Kashmir", "JK"],
    ["Jharkhand", "JH"],
    ["Karnataka", "KA"],
    ["Kerala", "KL"],
    ["Madhya Pradesh", "MP"],
    ["Maharashtra", "MH"],
    ["Manipur", "MN"],
    ["Meghalaya", "ML"],
    ["Mizoram", "MZ"],
    ["Nagaland", "NL"],
    ["Odisha", "OD"],
    ["Punjab", "PB"],
    ["Rajasthan", "RJ"],
    ["Sikkim", "SK"],
    ["Tamil Nadu", "TN"],
    ["Telangana", "TS"],
    ["Tripura", "TR"],
    ["Uttarakhand", "UK"],
    ["Uttar Pradesh", "UP"],
    ["West Bengal", "WB"],
    ["Andaman and Nicobar Islands", "AN"],
    ["Chandigarh", "CH"],
    ["Dadra and Nagar Haveli", "DN"],
    ["Daman and Diu", "DD"],
    ["Delhi", "DL"],
    ["Lakshadweep", "LD"],
    ["Puducherry", "PY"]
];
const createProduct = async (req, res, next) => {
    const productTag = req.body.tag;
    const productImages = [];
    const pinValidationInfo = await fetchAndValidatePIN(req.body.pincode, req.body.state);
    if (pinValidationInfo.status == false) {
        res.status(400).json({
            status: 'failure',
            message: 'Invalid PIN/State information'
        })
    } else {
        const result = pinValidationInfo.result;
        if (result.length > 0) {
            let location = [parseFloat(result[0].longitude), parseFloat(result[0].latitude)];
            /**
             * for geo-spatial query
             * always store in [long, lat] format in that order, also these values should be floats
             * create an index in db
             * db.products.createIndex({"address.location": "2dsphere"});
            **/
            req.body.location = {
                type: "Point",
                coordinates: location
            };
            req.body.locationMeta = result;
        }
    }
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
        productImages: req.body.productImages,
        address: {
            location: req.body.location, // for geospatial query
            state: req.body.state,
            pin: req.body.pincode,
            meta: req.body.locationMeta,
        }
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
const getPostalInfo = async (req, res, next) => {
    const pin = req.body.pin;
    const state = req.body.state;
    const postalInfo = await fetchAndValidatePIN(pin, state);
    res.status(200).json({
        status: "success",
        data: postalInfo
    })
}
const fetchAndValidatePIN = async (pin, state) => {
    // world postal collection
    let POSTAL_API = `https://api.worldpostallocations.com/pincode?postalcode=${pin}&countrycode=IN&apikey=2214-6ee88ae5-6da399ea-e54b2d1a-8dd18665e371eab8b1e`;
    const response = await fetch(POSTAL_API);
    const postalInfo = await response.json();
    return postalInfo;
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
        {
            label: 'state',
            fieldName: 'State',
            type: 'autocomplete',
            required: true,
            multiple: false,
            options: STATES_INFO,
        },
        {
            label: 'pincode',
            fieldName: 'PIN',
            type: 'number',
            required: true,
            multiple: false,
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
    let categoryExists = false;
    if (!category) {
        category = /./;
    } else {
        category = String(category).split(',');
        categoryExists = true;
    }
    let data = await Product.aggregate([
        { "$match": { category: categoryExists ? { "$in": category } : category } },
        {
            "$facet": {
                "products": [
                    { "$skip": page * limit },
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
const search = async (req, res, next) => {
    let searchItem = req.params.searchItem;
    if (searchItem) searchItem = searchItem.trim();
    let projections = {
        "name": 1, "category": 1
    }
    try {
        let autoComplete = await Product.aggregate([
            {
                "$search": {
                    "index": "searchProducts",
                    "autocomplete": {
                        "query": `${searchItem}`,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            },
            {
                $project: {
                    ...projections,
                    score: { $meta: 'searchScore' },
                }
            }
        ]).sort({ score: -1 }).limit(5);
        let searchResults = await Product.aggregate([
            {
                "$search": {
                    "index": "searchProductsTxt",
                    "text": {
                        "query": `${searchItem}`,
                        "path": {
                            "wildcard": "*"
                        },
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            },
            {
                $project: {
                    ...projections,
                    score: { $meta: 'searchScore' },
                }
            }

        ]).sort({ score: -1 }).limit(5);
        autoComplete.forEach(res => {
            if (!searchResults.find(r => {
                return r._id.toString() == res._id.toString();
            })) searchResults.push(res);
        })
        // sort in descending order of scores
        searchResults = searchResults.sort((a, b) => b.score - a.score);
        res.send({
            message: "Success",
            data: searchResults
        })
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "Product Not Found",
            data: null
        })
    }
}
const getProductsByIdList = async (req, res, next) => {
    const idList = req.body.idList;
    try {
        let products = await Product.find({ _id: { "$in": idList } });
        res.status(200).json({
            message: "Product list by ids fetched successfully",
            data: products
        })
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "Product Not Found",
            data: null
        })
    }
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
    search,
    getProductsByIdList,
    getPostalInfo,
    fetchAndValidatePIN,
}
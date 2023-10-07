const { ObjectId } = require("mongodb");
const Product = require('../models/Product')
const createProduct = async (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        note: req.body.note ? req.body.note : "",
        modelNo: req.body.modelNo ? req.body.modelNo : "",
        category: req.body.category ? req.body.category : "",
        seller: req.body.seller ? req.body.seller : new ObjectId(),
        boughtBy: req.body.boughtBy ? req.body.boughtBy : new ObjectId(),
    });
    await product.save().then((createdProduct) => {
        res.status(201).json({
            message: "Product added successfully",
            productId: createdProduct._id,
        });
    });
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
    Product.deleteOne({ _id: req.params.id }).then((result) => {
        console.log(result);
        res.status(200).json({ message: "Products deleted!" });
    });
}
module.exports = { createProduct, getAllProducts, deleteProductById }
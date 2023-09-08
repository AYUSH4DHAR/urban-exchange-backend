const Product = require('../models/product');
const express = require("express");
const productsRouter = express.Router();



productsRouter.post("/addProduct", (req, res, next) => {
    const post = new product({
        name: req.body.name,
        price: req.body.price,
        description : req.body.description,
        note : req.body.note ? req.body.note : '',
        modelNo : req.body.modelNo ? req.body.modelNo : '',
        category : req.body.category ? req.body.category : '',
        seller : req.body.seller ? req.body.seller : '',
        boughtBy : req.body.boughtBy ? req.body.boughtBy : '',
    });
    Product.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
});
productsRouter.get("allproducts", (req, res, next) => {
    Product.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            Products: documents
        });
    });
});
productsRouter.delete("/Product/:id", (req, res, next) => {
    Product.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "Products deleted!" });
    });
});

module.exports = productsRouter;
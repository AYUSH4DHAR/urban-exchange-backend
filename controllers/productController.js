const { ObjectId } = require("mongodb");
const Product = require("../models/Product");
const express = require("express");
const checkAuth = require("../middleware/check-auth");
const productsRouter = express.Router();

productsRouter.post("/",checkAuth, async (req, res, next) => {
    const post = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        note: req.body.note ? req.body.note : "",
        modelNo: req.body.modelNo ? req.body.modelNo : "",
        category: req.body.category ? req.body.category : "",
        seller: req.body.seller ? req.body.seller : new ObjectId(),
        boughtBy: req.body.boughtBy ? req.body.boughtBy : new ObjectId(),
    });
    await post.save().then((createdPost) => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id,
        });
    });
});
productsRouter.get("/", (req, res, next) => {
    Product.find().then((documents) => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            Products: documents,
        });
    });
});
productsRouter.delete(":id", checkAuth , (req, res, next) => {
    Product.deleteOne({ _id: req.params.id }).then((result) => {
        console.log(result);
        res.status(200).json({ message: "Products deleted!" });
    });
});

module.exports = productsRouter;

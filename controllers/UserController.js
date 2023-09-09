const Users = require('../models/User');
const express = require("express");
const userRouter = express.Router();

userRouter.post("/", (req, res, next) => {
    const User = new User({
        name: req.body.name,
        price: req.body.price,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        productsListed: req.body.productsListed ? req.body.productsListed : [],
        productsPurchased: req.body.productsPurchased ? req.body.productsPurchased : [],
        Phone: req.body.Phone ? req.body.Phone : '',
    });
    Users.save().then(createdPost => {
        res.status(201).json({
            message: "user added successfully",
            postId: createdPost._id
        });
    });
});
userRouter.get("/", (req, res, next) => {
    Users.find().then(documents => {
        res.status(200).json({
            message: "users fetched successfully!",
            users: documents
        });
    });
});
userRouter.delete("/:id", (req, res, next) => {
    Users.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "user deleted!" });
    });
});

module.exports = userRouter;
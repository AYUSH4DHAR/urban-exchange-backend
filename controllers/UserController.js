const Users = require('../models/User');
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

userRouter.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new Users({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
  });
  
  userRouter.post("/login", (req, res, next) => {
    let fetchedUser;
    Users.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "secret_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Auth failed"
        });
      });
  });


module.exports = userRouter;
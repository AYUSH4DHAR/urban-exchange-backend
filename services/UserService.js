const Users = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new Users({
            email: req.body.email,
            password: hash
        });
        user
            .save()
            .then(result => {
                res.status(201).json({
                    message: "User created!"
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
}
const logIn = async (req, res, next) => {
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
}
const getAllUsers = async (req, res, next) => {
    await Users.find().then(users => {
        res.status(200).json({
            message: "users fetched successfully!",
            users: users
        });
    });
}
const deleteUserById = async (req, res, next) => {
    Users.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "user deleted!" });
    });
}
module.exports = { signUp, logIn, getAllUsers, deleteUserById }
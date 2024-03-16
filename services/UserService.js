const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
    "1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const signUp = async (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user
            .save()
            .then((result) => {
                res.status(201).json({
                    message: "User created!",
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    });
};

const googleAuth = async (req, res, next) => {
    const tokenId = req.body.idToken; // Assuming you send the Google ID token from the client
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience:
                "1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com", // Verify that the token was issued to your client
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // Check if the email already exists in your database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // User already exists, generate a token and send it
            const token = jwt.sign(
                { email: existingUser.email, userId: existingUser._id },
                "secret_this_should_be_longer",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                user: existingUser,
            });
        } else {
            // User doesn't exist, create a new user
            bcrypt.hash("defaultPassword", 10).then((hash) => {
                const newUser = new User({
                    email: email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.name,
                    avatar: req.body.photoUrl,
                });

                newUser
                    .save()
                    .then((result) => {
                        // Now that the user is created, generate a token and send it
                        const token = jwt.sign(
                            { email: email, userId: result._id },
                            "secret_this_should_be_longer",
                            { expiresIn: "1h" }
                        );

                        res.status(201).json({
                            token: token,
                            expiresIn: 3600,
                            user: newUser
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            error: err,
                        });
                    });
            });
        }
    } catch (err) {
        // Handle errors here
        console.error(err);
        res.status(401).json({
            message: "Google Auth failed",
        });
    }
};

const logIn = async (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed. Username Incorrect",
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed. Password Incorrect.",
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                "secret_this_should_be_longer",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                user: fetchedUser,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Auth failed. Unhandled Error. User Not Found.",
            });
        });
};
const getAllUsers = async (req, res, next) => {
    await User.find().then((users) => {
        res.status(200).json({
            message: "users fetched successfully!",
            users: users,
        });
    });
};
const getUserById = async (req, res, next) => {
    await User.findOne({ _id: req.params.id }).then(
        (user) => {
            user.password = undefined;
            res.status(200).json({
                message: "success",
                data: user,
            });
        },
        (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: null,
            });
        }
    );
};
const deleteUserById = async (req, res, next) => {
    User.deleteOne({ _id: req.params.id }).then(
        (result) => {
            res.status(200).json({ message: "user deleted!" });
        },
        (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: null,
            });
        }
    );
};
const addToUserProducts = async (req, res, next) => {
    const _id = req.body._id;
    const productId = req.body.productId;
    addToUserProductsPersist(_id, productId).then(
        (result) => {
            res
                .status(200)
                .json({
                    status: "success",
                    message: "added products to user listed products",
                });
        },
        (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: null,
            });
        }
    );
};
const addToUserProductsPersist = async (_id, productId) => {
    return User.findOneAndUpdate(
        { _id: _id },
        { $push: { productsListed: productId } }
    );
};

// This function is used to add the user's wishlist to the user db
const addToUserWishlist = async (req, res, next) => {
    const _id = req.body._id;
    let setQuery = {"wishlist": req.body.wishlist};
    const query = { $set: setQuery};
    const options = { runValidators: true, new: true };
    User.findOneAndUpdate({ "_id": _id }, query, options).then(
        (result) => {
            res.status(200).json({
                status: "success",
                message: "added products to user listed products",
            });
        },
        (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: null,
            });
        }
    );
};

// This function is used to get the user's wishlist to the user db
const getUserWishlist = async (req, res, next) => {
    const _id = req.params.id;
    User.find({ "_id": _id }).then(
        (result) => {
            res.status(200).json({
                status: "success",
                data: (result && result[0] && result[0].wishlist)? result[0].wishlist : [],
            });
        },
        (error) => {
            console.error(error);
            res.status(404).json({
                message: "User Not Found",
                data: [],
            });
        }
    );
};
module.exports = {
    signUp,
    logIn,
    getAllUsers,
    deleteUserById,
    googleAuth,
    addToUserProducts,
    addToUserProductsPersist,
    getUserById,
    addToUserWishlist,
    getUserWishlist,
};

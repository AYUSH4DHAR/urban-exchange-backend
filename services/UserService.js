const Users = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

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

const googleAuth = async (req, res, next) => {
    const tokenId = req.body.token; // Assuming you send the Google ID token from the client

    console.log(req.body, "tokneId")
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: '1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com', // Verify that the token was issued to your client
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // Check if the email already exists in your database
        const existingUser = await Users.findOne({ email });

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
            });
        } else {
            // User doesn't exist, create a new user
            bcrypt.hash("defaultPassword", 10).then(hash => {
                const newUser = new Users({
                    email: email,
                    password: hash,
                });

                newUser
                    .save()
                    .then(result => {
                        // Now that the user is created, generate a token and send it
                        const token = jwt.sign(
                            { email: email, userId: result._id },
                            "secret_this_should_be_longer",
                            { expiresIn: "1h" }
                        );

                        res.status(201).json({
                            token: token,
                            expiresIn: 3600,
                        });
                    })
                    .catch(err => {
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
    }, (error) => {
        console.error(error);
        res.status(404).json({
            message: "User Not Found",
            data: null
        })
    });
}
module.exports = { signUp, logIn, getAllUsers, deleteUserById, googleAuth }
const express = require("express");
const userRouter = express.Router();
const userService = require('../services/UserService');
const passport = require('passport');

userRouter.post("/", async (req, res, next) => {
  await userService.signUp(req, res, next);
});
userRouter.get("/", async (req, res, next) => {
  await userService.getAllUsers(req, res, next);
});
userRouter.get("/:id", async (req, res, next) => {
  await userService.getUserById(req, res, next);
});
userRouter.delete("/:id", async (req, res, next) => {
  await userService.deleteUserById(req, res, next);
});
userRouter.post("/login", async (req, res, next) => {
  await userService.logIn(req, res, next);
});

userRouter.post("/googleAuth", async (req, res, next) => {
  await userService.googleAuth(req, res, next);
});
userRouter.post('/add-product', async (req, res, next) => {
  await userService.addToUserProducts(req, res, next);
});
userRouter.post('/add-wishlist', async (req, res, next) => {
  await userService.addToUserWishlist(req, res, next);
});
userRouter.get('/get-wishlist/:id', async (req, res, next) => {
  await userService.getUserWishlist(req, res, next);
});
userRouter.get('/google/login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }))

userRouter.get('auth/google/callback', passport.authenticate('google', { failureRedirect: '/err' }), (req, res) => {
  req.login(req.session.passport.user, function (err) {
    if (err) { return res.status(501).json(err); }
    return res.status(200).json({ message: 'Login Successful' });

  });
})

module.exports = userRouter;
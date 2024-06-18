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
// change name: POST [/user base]/products
userRouter.post('/add-product', async (req, res, next) => {
  await userService.addToUserProducts(req, res, next);
})
// change API signature GET - /user
userRouter.post('/getUserDetails', async (req, res, next) => {
  await userService.getUserData(req, res, next);
})
// change API signature PUT /user
userRouter.post('/setUserDetails', async (req, res, next) => {
  await userService.setUserData(req, res, next);
})
// change name [/user base]/wishlist [add is implicit]
userRouter.post('/add-wishlist', async (req, res, next) => {
  await userService.addToUserWishlist(req, res, next);
});
// change name [/user base]/wishlist/:id [get is implicit]
userRouter.get('/get-wishlist/:id', async (req, res, next) => {
  await userService.getUserWishlist(req, res, next);
});
// change name /ping
userRouter.post('/pingUser', async (req, res, next) => {
  await userService.pingUser(req, res, next);
});
userRouter.get('/google/login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }))

userRouter.get('auth/google/callback', passport.authenticate('google', { failureRedirect: '/err' }), (req, res) => {
  req.login(req.session.passport.user, function (err) {
    if (err) { return res.status(501).json(err); }
    return res.status(200).json({ message: 'Login Successful' });

  });
})

module.exports = userRouter;
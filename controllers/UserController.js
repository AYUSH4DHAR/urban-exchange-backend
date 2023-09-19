const express = require("express");
const userRouter = express.Router();
const userService = require('../services/UserService');

userRouter.post("/", async (req, res, next) => {
  await userService.signUp(req, res, next);
});
userRouter.get("/", async (req, res, next) => {
  await userService.getAllUsers(req, res, next);
});
userRouter.delete("/:id", async (req, res, next) => {
  await userService.deleteUserById(req, res, next);
});
userRouter.post("/login", async (req, res, next) => {
  await userService.logIn(req, res, next);
});


module.exports = userRouter;
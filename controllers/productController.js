const express = require("express");
const checkAuth = require("../middleware/check-auth");
const productsRouter = express.Router();

const productService = require('../services/ProductService');

productsRouter.post("/", checkAuth, async (req, res, next) => {
    await productService.createProduct(req, res, next);
});
productsRouter.get("/", async (req, res, next) => {
    await productService.getAllProducts(req, res, next);
});
productsRouter.get("/tag", async (req, res, next) => {
    await productService.createProductTag(req, res, next);
})
productsRouter.get("/create-product-fields", async (req, res, next) => {
    await productService.getCreateProductFields(req, res, next);
})
productsRouter.get("/:id", async (req, res, next) => {
    await productService.getProductById(req, res, next);
});
productsRouter.delete("/:id", checkAuth, async (req, res, next) => {
    await productService.deleteProductById(req, res, next);
});
module.exports = productsRouter;

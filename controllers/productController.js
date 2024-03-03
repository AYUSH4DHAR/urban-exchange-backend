const express = require("express");
const checkAuth = require("../middleware/check-auth");
const productsRouter = express.Router();

const productService = require('../services/ProductService');

productsRouter.post("/", checkAuth, async (req, res, next) => {
    await productService.createProduct(req, res, next);
});
productsRouter.get("/", async (req, res, next) => {
    await productService.getProductsByPageNoAndPageSizeAndOrCategory(req, res, next);
});
productsRouter.get("/tag", async (req, res, next) => {
    await productService.createProductTag(req, res, next);
})
productsRouter.get("/create-product-fields", async (req, res, next) => {
    await productService.getCreateProductFields(req, res, next);
})
productsRouter.get("/product-categories", async (req, res, next) => {
    await productService.getProductCategories(req, res, next);
})
productsRouter.get("/postal-info", async (req, res, next) => {
    await productService.getPostalInfo(req, res, next);
})
productsRouter.post("/product-list-by-id", async (req, res, next) => {
    await productService.getProductsByIdList(req, res, next);
})
productsRouter.get("/search/:searchItem", async (req, res, next) => {
    await productService.search(req, res, next);
})
productsRouter.get("/:id", async (req, res, next) => {
    await productService.getProductById(req, res, next);
});
productsRouter.delete("/:id", checkAuth, async (req, res, next) => {
    await productService.deleteProductById(req, res, next);
});
module.exports = productsRouter;

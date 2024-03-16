const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: false,
    },
    modelNo: {
        type: String,
    },
    category: {
        type: String,
    },
    seller: {
        type: ObjectId,
        required: true,
    },
    boughtBy: {
        type: ObjectId,
    },
    tag: {
        type: String,
    },
    productImages: {
        type: Array
    },
    address: {
        type: Object,
    },
    created: {
        type: Date,
    },
    lastUpdated: {
        type: Date
    },
    sellerUname: {
        type: String,
    }
});

module.exports = mongoose.model("Product", productSchema);

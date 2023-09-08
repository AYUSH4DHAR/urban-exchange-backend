const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const product = require("./models/product");
const app = express();

const productRoute = require('./routes/products-route');
const usersRoute =  require('./routes/users-route');

mongoose
    .connect(
        "mongodb+srv://aysid:aysid@cluster0.n8ceegw.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.use("/api/products", productRoute);
app.use("/api/users", usersRoute);




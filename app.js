const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const productRoute = require("./routes/productsRoute");
const usersRoute = require("./routes/usersRoute");

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
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );
    // res.setHeader(
    //     "Access-Control-Allow-Methods",
    //     "GET, POST, PATCH, DELETE, OPTIONS"
    // );
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow these HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use("/api/product", productRoute);
app.use("/api/user", usersRoute);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

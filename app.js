const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
const mongoose = require("mongoose");
const app = express();
var passport=require('passport')
var session = require ('express-session')
// require('./services/passport-config')
const productRoute = require("./routes/productsRoute");
const usersRoute = require("./routes/usersRoute");
const imageRoute = require("./routes/imagesRoute");

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

app.use(
    session({
      secret: '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', // Replace with a secure secret
      resave: true,
      saveUninitialized: true,
    })
  );
  
  // Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/product", productRoute);
app.use("/api/user", usersRoute);
app.use("/api/image", imageRoute);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

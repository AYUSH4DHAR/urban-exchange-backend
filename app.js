const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
const mongoose = require("mongoose");
const app = express();
const http = require('http');
var passport = require('passport')
var session = require('express-session')
// require('./services/passport-config')
const productRoute = require("./routes/productsRoute");
const usersRoute = require("./routes/usersRoute");
const chatRoute = require("./routes/chatRoute");
const imageRoute = require("./routes/imagesRoute");
const hashRoute = require("./routes/hashRoute");
require('dotenv').config();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });



mongoose
    .connect('mongodb+srv://uex:uex@urbanexchange.54fzlvg.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

    const obj = {};
    io.on('connection', socket => {
        console.log('New client connected');
        socket.on("createConnection", (userId) => {
            obj[userId] = socket.id;
        });
    
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    
        // Handle chat message events
        socket.on('chatMessage', async (body) => {
            io.to(obj[body.receiverId]).emit("receivedMsg", body.message);
            // io.emit('receivedMsg', message);
        });
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
        secret: 'OEOpdQIwmwgWUd8X1xkWrsQGBz_z', // Replace with a secure secret
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

app.use("/api/chat", chatRoute);




app.use("/api/hashtag", hashRoute);

app.get("*", (req, res, next) => {
    res.status(404).json({
        status: "Failure",
        message: "API Not Found"
    })
})



const PORT = 5000;
server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

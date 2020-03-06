require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("express-favicon");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const connectionString = "mongodb://localhost/chatter";
console.log("DBNAME", process.env.DB_NAME, "PASS", process.env.DB_PASSWORD);
const connectionStringProd =
  "mongodb://heroku_m6lk3rww:hh9dj5ls5mc6aucqn1ku9ffi2n@ds145146.mlab.com:45146/heroku_m6lk3rww";
console.log(connectionStringProd);
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(connectionStringProd, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.on("error", function(error) {
    console.log(error);
    console.log("ERROR CONNECT");
  });
} else {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const app = express();
const http = require("http").createServer(app);

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "client", "build", "favicon.ico")));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "client", "build")));
if (process.env.NODE_ENV !== "test") {
  app.get("*", function(req, res) {
    const index = path.join(__dirname, "client", "build", "index.html");
    res.sendFile(index);
  });
}

//Routes
app.use("/users", require("./server/routes/users"));
app.use("/auth", require("./server/routes/auth"));

module.exports = http;

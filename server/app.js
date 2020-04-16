require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("express-favicon");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectionString = "mongodb://localhost/chatter";

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", function (error) {
    console.log(error);
    console.log("ERROR CONNECT");
  });
  mongoose.connection.on("connected", function () {
    console.log("Connected");
  });
} else {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", function () {
    console.log("Connected");
  });
}

const app = (module.exports.app = express());

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "../client/build/favicon.ico")));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "../client/build")));
if (process.env.NODE_ENV !== "test") {
  app.get("*", function (req, res) {
    const index = path.join(__dirname, "../client/build/index.html");
    res.sendFile(index);
  });
}

app.use(function (req, res, next) {
  if (
    process.env.NODE_ENV !== "test" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  return next();
});

//Routes
app.use("/users", require("./routes/users"));
app.use("/chats", require("./routes/chats"));

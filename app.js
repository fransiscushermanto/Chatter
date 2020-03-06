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
    const index = path.join(process.cwd(), "client", "build", "index.html");
    res.sendFile(index);
  });
}
console.log(path.join("client", "build", "index.html"));

//Routes
app.use("/users", require("./server/routes/users"));
app.use("/auth", require("./server/routes/auth"));

module.exports = http;

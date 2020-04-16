const app = require("./server/app").app;
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const favicon = require("express-favicon");
const express = require("express");
const path = require("path");
const io = (module.exports.io = require("socket.io")(http));
const SocketManager = require("./server/helpers/SocketManager");

app.use(favicon(path.join(__dirname, "client", "build", "favicon.ico")));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "client", "build")));
if (process.env.NODE_ENV !== "test") {
  app.get("*", function (req, res) {
    const index = path.join(__dirname, "client", "build", "index.html");
    res.sendFile(index);
  });
}

io.on("connection", SocketManager);

http.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

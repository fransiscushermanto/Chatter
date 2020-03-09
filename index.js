const app = require("./app");
const port = process.env.PORT || 8550;
const https = require("https").createServer(app);
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

if (process.env.NODE_ENV !== "test") {
  https.listen(port, () => {
    console.log(`Product server listening on port ${port}`);
  });
} else {
  http.listen(port, () => {
    console.log(`Product server listening on port ${port}`);
  });
}

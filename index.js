const app = require("./app");
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

http.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

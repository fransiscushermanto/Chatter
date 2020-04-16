const app = require("./server/app").app;
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = (module.exports.io = require("socket.io")(http));
const SocketManager = require("./server/helpers/SocketManager");

io.on("connection", SocketManager);

http.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

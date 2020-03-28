const app = require("./app");
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  console.log(`UserId : ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("SEND_MESSAGE", data => {
    io.emit("RECEIVE_MESSAGE", data);
  });

  socket.on("GET_FRIEND", () => {
    io.emit("LOAD_FRIEND");
  });

  socket.on("JOIN_ROOM", ({ name, room }, callback) => {
    io.emit("LOAD_ROOM");
  });
});

http.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

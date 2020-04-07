const app = require("./app");
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("SEND_MESSAGE", ({ room, data }, callback) => {
    console.log(room);
    io.to(room).emit("RECEIVE_MESSAGE", { data });
  });

  socket.on("GET_FRIEND", ({ room }) => {
    io.to(room).emit("LOAD_FRIEND");
  });

  socket.on("JOIN_ROOM", ({ room }, callback) => {
    socket.join(room);
  });
});

http.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

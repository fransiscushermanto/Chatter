const app = require("./app");
const port = process.env.PORT || 8550;
const io = require("socket.io")(app);

io.on("connection", socket => {
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.listen(port, () => {
  console.log(`Product server listening on port ${port}`);
});

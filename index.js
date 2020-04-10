const app = require("./app");
const port = process.env.PORT || 8550;
const httpTemp = require("http");
const http = httpTemp.createServer(app);
const io = require("socket.io")(http);
const Friend = require("./server/models/friend");
const ChatRoom = require("./server/models/chatRoom");
const ChatHistory = require("./server/models/chatHistory");

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("SEND_MESSAGE", async ({ room, data }, callback) => {
    try {
      const newChat = new ChatHistory({
        room_id: data.room_id,
        chat: data.chat,
        sender_id: data.sender_id,
        time: data.time,
        status: data.status,
        backup: {
          person_1: data.sender_id,
          person_2: data.friend_id,
        },
      });
      await newChat.save((error) => {
        if (error) {
          console.log(error);
        }
      });

      const exist = await ChatRoom.findOne({
        $and: [{ user_id: data.friend_id }, { friend_id: data.sender_id }],
      });
      if (exist === null) {
        const existFriend = await Friend.findOne({
          $and: [{ user_id: data.friend_id }, { friend_id: data.sender_id }],
        });

        const statusFriend = existFriend ? "on" : "off";

        const newChatRoom = new ChatRoom({
          room_id: data.room_id,
          user_id: data.friend_id,
          friend_id: data.sender_id,
          lastchat: {
            sender_id: data.sender_id,
            chat: data.chat,
            time: data.time,
            status: data.status,
          },
          status: statusFriend,
        });

        await newChatRoom.save((error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      await ChatRoom.updateMany(
        {
          room_id: data.room_id,
        },
        {
          lastchat: {
            sender_id: data.sender_id,
            chat: data.chat,
            time: data.time,
            status: data.status,
          },
        }
      );

      const unreadExist = await ChatHistory.find({
        $and: [
          { room_id: data.room_id },
          { status: "unread" },
          { sender_id: data.friend_id },
        ],
      }).exec();

      if (unreadExist.length > 0) {
        await ChatHistory.updateMany(
          {
            $and: [
              { room_id: data.room_id },
              { status: "unread" },
              { sender_id: data.friend_id },
            ],
          },
          {
            status: "read",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    io.volatile.to(room).emit("RECEIVE_MESSAGE", { data });
    callback();
  });

  socket.on("UPDATE_MESSAGE", ({ room }, callback) => {
    console.log(room, "UPDATE");
    io.to(room).emit("REFRESH_MESSAGE");
    callback();
  });

  socket.on("ENTER_ROOM", ({ room, user }, callback) => {
    console.log(room, "ENTER");
    io.to(room).emit("REPREPARE_ROOM", { user });
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

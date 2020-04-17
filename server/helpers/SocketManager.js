const io = require("../../index").io;

const Friend = require("../models/friend");
const ChatRoom = require("../models/chatRoom");
const ChatHistory = require("../models/chatHistory");

module.exports = function (socket) {
  socket.on("NEW USER", (user) => {
    socket.broadcast.emit("LOAD_USER");
  });

  socket.on("DISCONNECT", () => {
    console.log("Thank You For Using Chatter");
  });

  socket.on("PREPARING", ({ room }) => {
    io.to(room).emit("REPREPARE_ROOM");
  });

  socket.on("GET_FRIEND", () => {
    socket.emit("LOAD_FRIEND");
  });

  socket.on("JOIN_CHAT_ROOM", (room) => {
    socket.join(room);
  });

  socket.on("INROOM_UPDATE_MESSAGE", ({ room }, callback) => {
    console.log("INROOM");
    callback();
    io.to(room).emit("RELOAD_MESSAGE");
  });

  socket.on("UPDATE_MESSAGE", ({ room }, callback) => {
    callback();
    console.log("OUTSIDE");
    socket.to(room).emit("RELOAD_MESSAGE");
  });

  socket.on("SEND_MESSAGE", async ({ room, data }, callback) => {
    console.log("RECEIVING");
    io.volatile.to(room).emit("RECEIVE_MESSAGE", { data });
    callback();
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

        socket.broadcast.emit("UPCOMING_ROOM");
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
  });
};

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

  socket.on("JOIN_CHAT_ROOM", ({ room }) => {
    socket.join(room);
  });

  socket.on("ALL_USER_UPDATE_MESSAGE", ({ room }, callback) => {
    console.log("INROOM");
    callback();
    io.to(room).emit("RELOAD_MESSAGE");
  });

  socket.on("TYPING", ({ room }) => {
    socket.to(room).emit("TYPING", room);
  });

  socket.on("UPDATE_ROOM", () => {
    socket.emit("UPDATE_ROOM");
  });

  socket.on("STOP_TYPING", ({ room }) => {
    socket.to(room).emit("STOP_TYPING");
  });

  socket.on("UPDATE_MESSAGE", ({ room }, callback) => {
    callback();
    console.log("OUTSIDE");
    socket.to(room).emit("RELOAD_MESSAGE");
  });

  socket.on("CLEAR_MESSAGES", async ({ data }) => {
    try {
      console.log(data);
      const chatHistoryExist = await ChatHistory.find({
        room_id: data.room_id,
      });

      const chatHistoryFriend = await ChatHistory.find({
        $and: [
          { room_id: data.room_id },
          {
            $or: [
              { "backup.person_1": data.friend_id },
              { "backup.person_2": data.friend_id },
            ],
          },
        ],
      });

      if (chatHistoryExist.length > 0) {
        if (chatHistoryFriend.length > 0) {
          await ChatHistory.updateMany(
            {
              $and: [{ room_id: data.room_id }],
            },
            {
              backup: {
                person_1: data.friend_id,
                person_2: "",
              },
            }
          );
        } else {
          await ChatHistory.deleteMany({ room_id: data.room_id });
        }
      }
      socket.emit("CLEAR_MESSAGES");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("IGNORE_CHAT_ROOM", async ({ data }) => {
    try {
      await ChatRoom.findOneAndUpdate(
        { $and: [{ user_id: data.user_id }, { friend_id: data.friend_id }] },
        { status: "on" },
        { new: true }
      );

      await Friend.findOneAndDelete({
        $and: [
          { user_id: data.user_id },
          { friend_id: data.friend_id },
          { status: "none" },
        ],
      });
    } catch (error) {
      console.log(error);
    }

    socket.emit("UPDATE_ROOM");
  });

  socket.on("OPEN_CHAT_ROOM", (friend) => {
    socket.emit("OPEN_CHAT_ROOM", friend);
  });

  socket.on("BLOCK", async ({ data }) => {
    try {
      const exist = await Friend.findOne({
        $and: [{ user_id: data.user_id }, { friend_id: data.friend_id }],
      });

      if (exist) {
        await Friend.findOneAndUpdate(
          { $and: [{ user_id: data.user_id }, { friend_id: data.friend_id }] },
          { status: "block" },
          { new: true }
        );

        await ChatRoom.findOneAndUpdate(
          {
            $and: [
              { room_id: data.room_id },
              { user_id: data.user_id },
              { friend_id: data.friend_id },
              { $or: [{ status: "on" }, { status: "off" }] },
            ],
          },
          { status: "block" }
        );
      } else {
        const newFriend = new Friend({
          user_id: data.user_id,
          friend_id: data.friend_id,
          status: "block",
        });

        await newFriend.save();
      }
    } catch (error) {
      console.log(error);
    }
    socket.emit("BLOCK");
  });

  socket.on("LEAVE_CHAT_ROOM", ({ room }) => {
    console.log("LEAVING", room);
    socket.leave(room);
  });

  socket.on("DELETE_CHAT_ROOM", async ({ data }) => {
    try {
      await ChatRoom.findOneAndDelete({
        $and: [
          { room_id: data.room_id },
          { user_id: data.user_id },
          { friend_id: data.friend_id },
        ],
      });

      const chatHistoryExist = await ChatHistory.find({
        room_id: data.room_id,
      });

      const chatHistoryFriend = await ChatHistory.find({
        $and: [
          { room_id: data.room_id },
          {
            $or: [
              { "backup.person_1": data.friend_id },
              { "backup.person_2": data.friend_id },
            ],
          },
        ],
      });

      if (chatHistoryExist.length > 0) {
        if (chatHistoryFriend.length > 0) {
          await ChatHistory.updateMany(
            {
              $and: [{ room_id: data.room_id }],
            },
            {
              backup: {
                person_1: data.friend_id,
                person_2: "",
              },
            }
          );
        } else {
          await ChatHistory.deleteMany({ room_id: data.room_id });
        }
      }
    } catch (error) {
      console.log(error);
    }
    socket.emit("DELETE_CHAT_ROOM");
  });

  socket.on("UNBLOCK", async ({ data }) => {
    try {
      await ChatRoom.findOneAndUpdate(
        {
          $and: [
            { room_id: data.room_id },
            { user_id: data.user_id },
            { friend_id: data.friend_id },
            { status: "block" },
          ],
        },

        { status: "off" }
      );

      await Friend.findOneAndUpdate(
        {
          $and: [
            { user_id: data.user_id },
            { friend_id: data.friend_id },
            { status: "block" },
          ],
        },
        { status: "none" }
      );
    } catch (error) {
      console.log(error);
    }

    socket.emit("UNBLOCK");
  });

  socket.on("SEND_MESSAGE", async ({ room, data }, callback) => {
    io.volatile.to(room).emit("RECEIVE_MESSAGE", { data });
    callback();
    try {
      const blocked = await Friend.findOne({
        $and: [
          { user_id: data.friend_id },
          { friend_id: data.sender_id },
          { status: "block" },
        ],
      });
      const newChat = new ChatHistory({
        room_id: data.room_id,
        chat: data.chat,
        sender_id: data.sender_id,
        time: data.time,
        status: data.status,
        backup: {
          person_1: data.sender_id,
          person_2: blocked ? "" : data.friend_id,
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

      if (blocked) {
        await ChatRoom.findOneAndUpdate(
          {
            $and: [
              { room_id: data.room_id },
              { user_id: data.sender_id },
              { friend_id: data.friend_id },
            ],
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
      } else {
        if (exist === null) {
          const existFriend = await Friend.findOne({
            $and: [
              { user_id: data.friend_id },
              { friend_id: data.sender_id },
              { status: "friend" },
            ],
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
      }

      const unreadExist = await ChatHistory.find({
        $and: [
          { room_id: data.room_id },
          { status: "unread" },
          { sender_id: data.friend_id },
          {
            $or: [
              { "backup.person_1": data.sender_id },
              { "backup.person_2": data.sender_id },
            ],
          },
        ],
      }).exec();

      if (unreadExist.length > 0) {
        await ChatHistory.updateMany(
          {
            $and: [
              { room_id: data.room_id },
              { status: "unread" },
              { sender_id: data.friend_id },
              {
                $or: [
                  { "backup.person_1": data.sender_id },
                  { "backup.person_2": data.sender_id },
                ],
              },
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

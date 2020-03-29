const JWT = require("jsonwebtoken");
const md5 = require("md5");

const Friend = require("../models/friend");
const ChatRoom = require("../models/chatRoom");
const ChatHistory = require("../models/chatHistory");

signToken = user => {
  return JWT.sign(
    {
      sub: user,
      iat: Date.now()
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = {
  createRoom: async (req, res, next) => {
    const { user_id, friend_id, user } = req.body;

    const exist = await ChatRoom.findOne({
      $or: [
        { $and: [{ user_id: user_id }, { friend_id: friend_id }] },
        { $and: [{ user_id: friend_id }, { friend_id: user_id }] }
      ]
    });

    if (exist) {
      const token = signToken(user);
      return res.status(200).send({ token, room: exist });
    }

    const room_id = md5(user_id + friend_id);

    const existFriend = await Friend.findOne({
      $and: [{ user_id: friend_id }, { friend_id: user_id }]
    });

    const status = existFriend ? "on" : "off";

    const newChatRoom = [
      {
        room_id: room_id,
        user_id: user_id,
        friend_id: friend_id,
        lastchat: {
          sender_id: "",
          chat: ""
        },
        status: "on"
      },
      {
        room_id: room_id,
        user_id: friend_id,
        friend_id: user_id,
        lastchat: {
          sender_id: "",
          chat: ""
        },
        status: status
      }
    ];

    const result = await ChatRoom.collection.insert(
      newChatRoom,
      (err, docs) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("Room Created");
        }
      }
    );

    const token = signToken(user);
    console.log(result);
    res.status(200).json({ token, room: result });
  },
  getAllRoom: async (req, res, next) => {
    const { user_id, user } = req.body;

    const allRoom = await ChatRoom.find({
      $or: [{ user_id: user_id }]
    });

    const token = signToken(user);
    return res.status(200).send({ token, room: allRoom });
  },
  sendChat: async (req, res, next) => {
    const { room_id, sender_id, chat, time, status } = req.body;

    const newChat = new ChatHistory({
      room_id: room_id,
      chat: chat,
      sender_id: sender_id,
      time: time,
      status: status
    });

    await ChatRoom.updateMany(
      {
        room_id: room_id
      },
      {
        lastchat: {
          sender_id: sender_id,
          chat: chat,
          time: time,
          status: status
        }
      }
    );
    await newChat.save(error => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message saved!");
      }
    });
    res.status(200);
  },
  getAllChat: async (req, res, next) => {
    const { room_id, user } = req.body;
    var criteria;
    if (room_id !== "all") {
      criteria = { room_id: room_id };
    } else {
      criteria = {};
    }

    const chatHistory = await ChatHistory.find(criteria);

    const token = signToken(user);
    return res.status(200).send({ token, chat: chatHistory });
  }
};

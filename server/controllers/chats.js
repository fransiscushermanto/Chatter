const JWT = require("jsonwebtoken");
const md5 = require("md5");

const Friend = require("../models/friend");
const ChatRoom = require("../models/chatRoom");
const ChatHistory = require("../models/chatHistory");

signToken = (user) => {
  return JWT.sign(
    {
      sub: user,
      iat: Date.now(),
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = {
  createRoom: async (req, res, next) => {
    const { user_id, friend_id, user } = req.body;
    try {
      const exist = await ChatRoom.findOne({
        $or: [
          { $and: [{ user_id: user_id }, { friend_id: friend_id }] },
          { $and: [{ user_id: friend_id }, { friend_id: user_id }] },
        ],
      });

      if (exist) {
        const token = signToken(user);
        return res.status(200).send({ token, room: exist });
      }

      const room_id = md5(user_id + friend_id);

      const newChatRoom = new ChatRoom({
        room_id: room_id,
        user_id: user_id,
        friend_id: friend_id,
        lastchat: {
          sender_id: "",
          chat: "",
        },
        status: "on",
      });

      await newChatRoom.save((error) => {
        if (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
    const token = signToken(user);
    console.log(result);
    res.status(200).json({ token, room: result });
  },
  getAllRoom: async (req, res, next) => {
    const { user_id, user } = req.body;

    const allRoom = await ChatRoom.find({
      $or: [{ user_id: user_id }],
    });

    const token = signToken(user);
    return res.status(200).send({ token, room: allRoom });
  },
  getAllChat: async (req, res, next) => {
    const { room_id, user, skip } = req.body;
    var criteria, limit;
    if (room_id !== "all") {
      criteria = {
        $and: [
          { room_id: room_id },
          {
            $or: [
              { "backup.person_1": user._id },
              { "backup.person_2": user._id },
            ],
          },
        ],
      };
      limit = 30;
    } else {
      criteria = {
        $or: [{ "backup.person_1": user._id }, { "backup.person_2": user._id }],
      };
      limit = 0;
    }
    console.log(skip);
    const chatHistory = await ChatHistory.find(criteria)
      .limit(limit)
      .skip(skip)
      .sort({ time: -1 });

    const token = signToken(user);
    return res.status(200).send({ token, chat: chatHistory });
  },
  updateChatStatus: async (req, res, next) => {
    const { room_id, sender_id } = req.body;
    const unreadExist = await ChatHistory.find({
      $and: [
        { room_id: room_id },
        { status: "unread" },
        { sender_id: sender_id },
      ],
    }).exec();

    if (unreadExist.length > 0) {
      await ChatHistory.updateMany(
        {
          $and: [
            { room_id: room_id },
            { status: "unread" },
            { sender_id: sender_id },
          ],
        },
        {
          status: "read",
        }
      );
      return res.status(200).send({ message: true });
    } else {
      return res.status(200).send({ message: false });
    }
  },
};

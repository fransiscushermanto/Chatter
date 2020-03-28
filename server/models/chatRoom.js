const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  room_id: {
    type: String
  },
  user_id: {
    type: String
  },
  friend_id: {
    type: String
  },
  lastchat: {
    sender_id: {
      type: String
    },
    chat: {
      type: String
    },
    time: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["read", "unread"]
    }
  },
  status: {
    type: String,
    enum: ["on", "off"]
  }
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

module.exports = ChatRoom;

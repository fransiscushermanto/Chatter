const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatHistorySchema = new Schema({
  room_id: {
    type: String
  },
  chat: {
    type: String
  },
  sender_id: {
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
});

const ChatHistory = mongoose.model("chatHistory", ChatHistorySchema);

module.exports = ChatHistory;

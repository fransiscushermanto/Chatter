const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  id_senderFriendReq: {
    type: String
  },
  id_receiverFriendReq: {
    type: String
  },
  status: {
    type: String,
    enum: ["friend", "blocked"]
  }
});

const Friend = mongoose.model("friend", friendSchema);

module.exports = Friend;

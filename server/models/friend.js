const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  user_id: {
    type: String,
  },
  friend_id: {
    type: String,
  },
  status: {
    type: String,
    enum: ["friend", "block", "none"],
  },
});

const Friend = mongoose.model("friend", friendSchema);

module.exports = Friend;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true,
  },
  local: {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    level: {
      type: String,
    },
    verified: {
      type: String,
      enum: ["yes", "no"],
    },
    status: {
      type: String,
      enum: ["on", "off"],
    },
    online: {
      type: String,
      enum: ["on", "off"],
    },
  },
  google: {
    id: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    level: {
      type: String,
    },
    verified: {
      type: String,
      enum: ["yes", "no"],
    },
    status: {
      type: String,
      enum: ["on", "off"],
    },
    online: {
      type: String,
      enum: ["on", "off"],
    },
  },
  facebook: {
    id: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    level: {
      type: String,
    },
    verified: {
      type: String,
      enum: ["yes", "no"],
    },
    level: {
      type: String,
    },
    status: {
      type: String,
      enum: ["on", "off"],
    },
    online: {
      type: String,
      enum: ["on", "off"],
    },
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.method !== "local") {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.local.password, salt);
    this.local.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;

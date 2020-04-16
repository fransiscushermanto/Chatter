const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Friend = require("../models/friend");
const ChatRoom = require("../models/chatRoom");

signToken = (user) => {
  console.log(user);
  if (!user) {
    return null;
  }

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
  signUp: async (req, res, next) => {
    const { email, password, fullname } = req.value.body;
    const exist = await User.findOne({ "local.email": email });
    if (exist) {
      return res.status(403).send({ error: "Email is already exist" });
    }
    const newUser = new User({
      method: "local",
      local: {
        fullname: fullname,
        email: email,
        password: password,
        level: "customer",
        verified: "yes",
        status: "on",
      },
    });
    await newUser.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Data Created");
      }
    });

    const token = signToken(newUser);

    res.status(200).json({ token });
  },
  updateDataOauth: async (req, res, next) => {
    const { fullname, id, method, status } = req.value.body;

    if (method === "google") {
      try {
        const updateUser = await User.findOneAndUpdate(
          { "google.id": id },
          { "google.fullname": fullname, "google.status": status },
          { new: true }
        );
        const token = signToken(updateUser);
        res.status(200).json({ token });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const updateUser = await User.findOneAndUpdate(
          { "facebook.id": id },
          { "facebook.fullname": fullname, "facebook.status": status },
          { new: true }
        );
        const token = signToken(updateUser);
        res.status(200).json({ token });
      } catch (error) {
        console.log(error);
      }
    }
  },
  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
    console.log("Logged in");
  },
  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  facebookOAuth: async (req, res, next) => {
    console.log(req.authInfo.message);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  getUserData: async (req, res, next) => {
    var name = req.body.fullname;
    var user_id = req.body.user_id;
    var criteria, limit;
    if (name !== "all") {
      criteria = {
        $or: [
          { "local.fullname": { $regex: ".*" + name + ".*", $options: "i" } },
          {
            "facebook.fullname": { $regex: ".*" + name + ".*", $options: "i" },
          },
          { "google.fullname": { $regex: ".*" + name + ".*", $options: "i" } },
        ],
      };
      limit = 20;
    } else {
      criteria = {};
      limit = 0;
    }

    const query = User.find(criteria).limit(limit);
    const data = await query.where("_id").ne(user_id).exec();
    const token = signToken(req.body.user);
    res.status(200).json({ data, token });
  },
  updateToken: async (req, res, next) => {
    const user = req.body.user;
    const token = signToken(user);
    res.status(200).json({ token });
  },
  addFriend: async (req, res, next) => {
    const { friendId, userId, user } = req.body;
    try {
      const exist = await ChatRoom.findOne({
        $and: [{ user_id: userId }, { friend_id: friendId }],
      });

      if (exist) {
        await ChatRoom.findOneAndUpdate(
          { $and: [{ user_id: userId }, { friend_id: friendId }] },
          { status: "on" },
          { new: true }
        );
      }

      const existFriend = await Friend.findOne({
        $and: [{ user_id: userId }, { friend_id: friendId }],
      });

      if (existFriend) {
        const token = signToken(user);
        return res.status(400).json({ existFriend, token });
      }

      const newFriend = new Friend({
        user_id: userId,
        friend_id: friendId,
        status: "friend",
      });

      await newFriend.save();
      const token = signToken(user);
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
    }
  },
  getCurrentFriend: async (req, res, next) => {
    var user_id = req.body.user_id;
    const friends = await Friend.aggregate([
      { $match: { user_id: user_id } },
      {
        $project: {
          friend_id: {
            $toObjectId: "$friend_id",
          },
          user_id: {
            $toString: "$user_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friend_id",
          foreignField: "_id",
          as: "my_friend",
        },
      },
    ]);

    const token = signToken(req.body.user);
    res.status(200).json({ friends, token });
  },
};

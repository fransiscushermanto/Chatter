const JWT = require("jsonwebtoken");
const User = require("../models/user");

signToken = user => {
  return JWT.sign(
    {
      sub: user,
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1
    },
    process.env.JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password, fullname } = req.value.body;
    console.log("REQ VALUE", req.value.body);
    const exist = await User.findOne({ "local.email": email });
    if (exist) {
      return res.status(403).send({ error: "Email is already exist" });
    }
    console.log("EXIST", exist);
    const newUser = new User({
      method: "local",
      local: {
        fullname: fullname,
        email: email,
        password: password,
        level: "customer",
        verified: "yes",
        status: "on"
      }
    });
    await newUser.save();
    console.log("NEW USER", newUser);
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
  getUserSecret: async (req, res, next) => {
    const userData = req.user;
    res.status(200).json({ userData, message: "SECRET" });
  }
};

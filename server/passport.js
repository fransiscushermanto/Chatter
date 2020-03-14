const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-token-google").Strategy;
const FacebookStrategy = require("passport-facebook-token");
const FacebookStrategy2 = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local");

const User = require("./models/user");

//JSON WEB TOKEN STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//LOGIN STRATEGY
const localStrategy = {
  usernameField: "email"
};
passport.use(
  "signin",
  new LocalStrategy(localStrategy, async (email, password, done) => {
    try {
      const user = await User.findOne({
        "local.email": email,
        "local.status": "on"
      });

      if (!user) {
        return done(null, false);
      }

      const isMatch = await user.isValidPassword(password);

      if (!isMatch) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

//FACEBOOK OAuth 2 STRATEGY
const facebookStrategy2 = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/users/oauth/facebook/callbak",
  profileFields: ["id", "displayName", "email", "photos"]
};

passport.use(
  "facebook",
  new FacebookStrategy2(
    facebookStrategy2,
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
    }
  )
);

//FACEBOOK OAuth STRATEGY
const facebookStrategy = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET
};

passport.use(
  "facebookToken",
  new FacebookStrategy(
    facebookStrategy,
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile", profile);
        const existingUser = await User.findOne({
          "facebook.id": profile.id
        });

        if (existingUser) {
          return done(null, existingUser, { message: "EXIST" });
        }
        console.log("User is not registered, Registering...");

        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            level: "customer",
            verified: "yes",
            status: "off"
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//GOOGLE OAuth STRATEGY
const googleStrategy = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
};
passport.use(
  "googleToken",
  new GoogleStrategy(
    googleStrategy,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          "google.id": profile.id
        });

        if (existingUser) {
          return done(null, existingUser);
        }
        console.log("User is not registered, Registering...");

        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            fullname: "",
            email: profile.emails[0].value,
            level: "customer",
            verified: "yes",
            status: "off"
          }
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

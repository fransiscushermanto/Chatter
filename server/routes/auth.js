require("../passport");
const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const passportFacebook = passport.authenticate(
  "facebook",
  {
    scope: ["id", "displayName", "email", "photos"]
  },
  (req, res) => {
    req.setHeader("X-Requested-With", "XMLHttpRequest");
    console.log(res);
  }
);

router.route("/facebook").get(passportFacebook);
router.route("/facebook/callback").get(
  passport.authenticate(
    "facebook",
    {
      successRedirect: "/",
      failureRedirect: "/signin"
    },
    (req, res) => {
      console.log(res);
    }
  )
);
module.exports = router;

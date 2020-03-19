require("../passport");
const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const { validateBody, schemas } = require("../helpers/validationHelper");
const UsersController = require("../controllers/users");
const passportSignIn = passport.authenticate("signin", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });
const passportFacebook = passport.authenticate("facebookToken", {
  session: false
});

router
  .route("/signup")
  .post(validateBody(schemas.registerSchema), UsersController.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.loginSchema),
    passportSignIn,
    UsersController.signIn
  );

router
  .route("/update")
  .post(
    validateBody(schemas.oauthCompletionSchema),
    UsersController.updateDataOauth
  );

router.route("/oauth/google").post(passportGoogle, UsersController.googleOAuth);

router
  .route("/oauth/facebook")
  .post(passportFacebook, UsersController.facebookOAuth);

router
  .route("/findFriend")
  .post(
    validateBody(schemas.searchScehma),
    passportJWT,
    UsersController.getUserData
  );

router.route("/addFriend").post(passportJWT, UsersController.addFriend);
router
  .route("/currentFriend")
  .post(passportJWT, UsersController.getCurrentFriend);

module.exports = router;

require("../passport");
const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const { validateBody, schemas } = require("../helpers/validationHelper");
const ChatController = require("../controllers/chats");
const passportJWT = passport.authenticate("jwt", { session: false });

router
  .route("/createRoom")
  .post(
    validateBody(schemas.createRoomSchema),
    passportJWT,
    ChatController.createRoom
  );

router
  .route("/loadAllRoom")
  .post(validateBody(schemas.getRoom), passportJWT, ChatController.getAllRoom);

router
  .route("/loadAllChat")
  .post(validateBody(schemas.getChat), passportJWT, ChatController.getAllChat);

router
  .route("/updateChatReadStatus")
  .post(passportJWT, ChatController.updateChatStatus);

module.exports = router;

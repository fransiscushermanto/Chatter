import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import authReducer from "./auth";
import decodeReducer from "./decodeData";
import loadUsersReducer from "./loadUsers";
import loadFriendReducer from "./loadFriend";
import chatRoomReducer from "./chatRoom";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  decode: decodeReducer,
  user: loadUsersReducer,
  friend: loadFriendReducer,
  personal: chatRoomReducer
});

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import authReducer from "./auth";
import decodeReducer from "./decodeData";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  decode: decodeReducer
});

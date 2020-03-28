import { CREATE_ROOM, ROOM_ERROR, LOAD_ALL_CHAT } from "../actions/types";

const DEFAULT_STATE = {
  data: [],
  errorMessage: "",
  chat: []
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case CREATE_ROOM:
      return { ...state, data: action.payload, errorMessage: "" };

    case LOAD_ALL_CHAT:
      return { ...state, chat: action.payload, errorMessage: "" };

    case ROOM_ERROR:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

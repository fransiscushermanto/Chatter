import { GET_DECODE_DATA } from "../actions/types";

const DEFAULT_STATE = {
  user: "",
  method: ""
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_DECODE_DATA:
      // console.log("[AuthReducer] got an GET_DECODE_DATA actions");
      return {
        user: action.payload,
        method: action.method
      };
    default:
      return state;
  }
};

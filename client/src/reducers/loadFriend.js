import { GET_LIST_FRIEND } from "../actions/types";

const DEFAULT_STATE = {
  data: ""
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_LIST_FRIEND:
      return {
        data: action.payload
      };
    default:
      return state;
  }
};

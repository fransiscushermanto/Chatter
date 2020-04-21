import {
  AUTH_ERROR,
  AUTH_SIGN_IN,
  AUTH_SIGN_UP,
  AUTH_SIGN_OUT,
  OAUTH_SIGN_UP,
  CHECK_EMAIL,
} from "../actions/types";

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: "",
  errorMessage: "",
  authType: "",
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGN_UP:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: "",
        authType: action.authType,
      };
    case AUTH_SIGN_IN:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: "",
        authType: action.authType,
      };
    case AUTH_SIGN_OUT:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: false,
        errorMessage: "",
        authType: "",
      };
    case OAUTH_SIGN_UP:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: "",
        authType: action.authType,
      };

    case AUTH_ERROR:
      console.log("EEOE", "'", action.payload, "'");
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

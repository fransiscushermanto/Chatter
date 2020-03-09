import axios from "../instance";
import jwt from "jsonwebtoken";
import {
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  OAUTH_SIGN_UP,
  GET_DECODE_DATA
} from "../actions/types";

export const signUp = data => {
  return async dispatch => {
    try {
      console.log("[ActionCreator] signUp dispatch");
      const res = await axios.post("/users/signup", data);
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token,
        authType: "local"
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "local");
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email is already in used",
        authType: "signup"
      });
      localStorage.setItem("AUTH_TYPE", "signup");
      console.log("err: ", error);
    }
  };
};

export const signIn = data => {
  return async dispatch => {
    try {
      console.log("[ActionCreator] signIn dispatch");
      const res = await axios.post("/users/signin", data);
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token,
        authType: "local"
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "local");
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email or password is invalid",
        authType: "signin"
      });
      localStorage.setItem("AUTH_TYPE", "signin");
      console.log("err:", error);
    }
  };
};

export const signOut = data => {
  return dispatch => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("AUTH_TYPE");
    axios.defaults.headers.common["Authorization"] = "";
    dispatch({
      type: AUTH_SIGN_OUT,
      payload: ""
    });
  };
};

export const oauthFacebook = data => {
  return async dispatch => {
    try {
      const res = await axios.post("/users/oauth/facebook", {
        access_token: data
      });
      const jwtData = await jwt.verify(
        res.data.token,
        process.env.REACT_APP_JWT_SECRET
      );

      const dataStatus = jwtData.sub.facebook.status === "on" ? "" : "oauth";
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: dataStatus
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", dataStatus);
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Invalid"
      });
      console.log("err:", error);
    }
  };
};

export const oauthGoogle = data => {
  return async dispatch => {
    try {
      const res = await axios.post("/users/oauth/google", {
        access_token: data
      });

      const jwtData = await jwt.verify(
        res.data.token,
        process.env.REACT_APP_JWT_SECRET
      );
      const dataStatus = jwtData.sub.google.status === "on" ? "" : "oauth";
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: dataStatus
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", dataStatus);
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Invalid"
      });
      console.log("err:", error);
    }
  };
};

export const decodeJWT = data => {
  return async dispatch => {
    const res = await jwt.verify(data, process.env.REACT_APP_JWT_SECRET);
    const method = res.sub === null ? "" : res.sub.method;
    dispatch({
      type: GET_DECODE_DATA,
      payload: res.sub,
      method: method
    });
  };
};

export const updateData = data => {
  return async dispatch => {
    try {
      console.log("[ActionCreator] updateData dispatch");
      const res = await axios.post("/users/update", data);
      console.log(res);
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: ""
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "");
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Server error"
      });
      console.log("err:", error);
    }
  };
};

export const resetState = data => {
  return dispatch => {
    console.log("[ActionCreator] resetError dispatch");
    dispatch({
      type: AUTH_ERROR,
      payload: ""
    });
  };
};

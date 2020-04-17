import axios from "../instance";
import jwt from "jsonwebtoken";
import {
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  OAUTH_SIGN_UP,
  GET_DECODE_DATA,
  GET_USERS_DATA,
  GET_LIST_FRIEND,
  CREATE_ROOM,
  ROOM_ERROR,
  LOAD_ALL_CHAT,
} from "../actions/types";

export const signUp = (data) => {
  return async (dispatch) => {
    try {
      console.log("[ActionCreator] signUp dispatch");
      const res = await axios.post("/users/signup", data);
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token,
        authType: "local",
      });
      decodeJWT(res.data.token);
      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "local");
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email is already in used",
        authType: "signup",
      });
      localStorage.setItem("AUTH_TYPE", "signup");
      console.log("err: ", error);
    }
  };
};

export const signIn = (data) => {
  return async (dispatch) => {
    try {
      console.log("[ActionCreator] signIn dispatch");
      const res = await axios.post("/users/signin", data);
      decodeJWT(res.data.token);
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token,
        authType: "local",
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "local");
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Email or password is invalid",
        authType: "signin",
      });
      localStorage.setItem("AUTH_TYPE", "signin");
      console.log("err:", error);
    }
  };
};

export const signOut = (data) => {
  return (dispatch) => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("AUTH_TYPE");
    axios.defaults.headers.common["Authorization"] = "";
    dispatch({
      type: AUTH_SIGN_OUT,
      payload: "",
    });
  };
};

export const oauthFacebook = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/users/oauth/facebook", {
        access_token: data,
      });
      const jwtData = await jwt.verify(
        res.data.token,
        process.env.REACT_APP_JWT_SECRET
      );
      const dataStatus = jwtData.sub.facebook.status === "on" ? "" : "oauth";
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: dataStatus,
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", dataStatus);
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Invalid",
      });
      console.log("err:", error);
    }
  };
};

export const oauthGoogle = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/users/oauth/google", {
        access_token: data,
      });

      const jwtData = await jwt.verify(
        res.data.token,
        process.env.REACT_APP_JWT_SECRET
      );
      const dataStatus = jwtData.sub.google.status === "on" ? "" : "oauth";
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: dataStatus,
      });

      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", dataStatus);
      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Invalid",
      });
      console.log("err:", error);
    }
  };
};

export const decodeJWT = (data) => {
  return async (dispatch) => {
    const res = await jwt.verify(data, process.env.REACT_APP_JWT_SECRET);
    const method = res.sub === null ? "" : res.sub.method;
    dispatch({
      type: GET_DECODE_DATA,
      payload: res.sub,
      method: method,
    });
  };
};

export const updateData = (data) => {
  return async (dispatch) => {
    try {
      console.log("[ActionCreator] updateData dispatch");
      const res = await axios.post("/users/update", data);
      dispatch({
        type: OAUTH_SIGN_UP,
        payload: res.data.token,
        authType: "",
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
      localStorage.setItem("AUTH_TYPE", "");
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Server error",
      });
      console.log("err:", error);
    }
  };
};

export const resetState = (data) => {
  return (dispatch) => {
    console.log("[ActionCreator] resetError dispatch");
    dispatch({
      type: AUTH_ERROR,
      payload: "",
    });
  };
};

export const findFriend = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/users/findFriend", data);
      dispatch({
        type: GET_USERS_DATA,
        payload: res.data,
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      dispatch({
        type: GET_USERS_DATA,
        payload: "",
      });
    }
  };
};

export const addFriend = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/users/addFriend", data);
      console.log(res);
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: "Failed to add Friend due to server error",
      });
    }
  };
};

export const getCurrentFriend = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/users/currentFriend", data);
      dispatch({
        type: GET_LIST_FRIEND,
        payload: res.data,
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      console.log("Failed to load Friend");
    }
  };
};

export const createRoom = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/chats/createRoom", data);
      console.log(res);
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      dispatch({
        type: ROOM_ERROR,
        payload: "Failed to create Room",
      });
    }
  };
};

export const loadRoom = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/chats/loadAllRoom", data);
      dispatch({
        type: CREATE_ROOM,
        payload: res.data.room,
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      dispatch({
        type: ROOM_ERROR,
        payload: "Failed to load Room",
      });
    }
  };
};

export const loadAllChat = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post("/chats/loadAllChat", data);
      dispatch({
        type: LOAD_ALL_CHAT,
        payload: res.data.chat,
      });
      localStorage.setItem("JWT_TOKEN", res.data.token);
    } catch (error) {
      console.log(error);
    }
  };
};

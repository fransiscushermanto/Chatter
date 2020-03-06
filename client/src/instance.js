import axios from "axios";

var instance = axios.create({
  baseURL: `${process.env.REACT_APP_SOCKET_URL || window.location.origin}`,
  header: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "X-Requested-With": "XMLHttpRequest"
  },
  simple: false
});

export default instance;

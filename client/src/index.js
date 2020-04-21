import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import reduxThunk from "redux-thunk";
import HttpsRedirect from "react-https-redirect";

import App from "./components/App";
import reducers from "./reducers";
import * as serviceWorker from "./serviceWorker";
import authGuard from "./components/HOCs/authGuard";
import oauthGuard from "./components/HOCs/oauthGuard";
import pageAuthGuard from "./components/HOCs/pageAuthGuard";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import CompleteData from "./components/CompleteData";
import ForgetPassword from "./components/ForgetPassword";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../src/css/style.css";
import axios from "./instance";

const jwtToken = localStorage.getItem("JWT_TOKEN");
const authType = localStorage.getItem("AUTH_TYPE");
document.cookie = "Set-Cookie;HttpOnly;Secure;SameSite=Strict";
axios.defaults.headers.common["Authorization"] = jwtToken;
axios.defaults.headers.common["Set-Cookie"] = "HttpOnly;Secure;SameSite=Strict";
ReactDOM.render(
  <Provider
    store={createStore(
      reducers,
      {
        auth: {
          token: jwtToken,
          isAuthenticated: jwtToken ? true : false,
          authType: authType,
        },
      },
      applyMiddleware(reduxThunk)
    )}
  >
    <HttpsRedirect>
      <Router>
        <App history={useHistory}>
          <Route exact path="/" component={authGuard(Home)} />
          <Route path="/home" component={authGuard(Home)} />
          <Route exact path="/signup" component={pageAuthGuard(SignUp)} />
          <Route exact path="/signin" component={pageAuthGuard(SignIn)} />
          <Route
            exact
            path="/personalData"
            component={oauthGuard(CompleteData)}
          />
          <Route
            exact
            path="/resetPassword"
            component={pageAuthGuard(ForgetPassword)}
          />
        </App>
      </Router>
    </HttpsRedirect>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

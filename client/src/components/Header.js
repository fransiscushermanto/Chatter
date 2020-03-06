import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../css/Header.css";
import * as actions from "../actions";

const Header = props => {
  console.log();
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const authType = useSelector(state => state.auth.authType);
  const signOut = () => {
    dispatch(actions.signOut());
    window.location.replace("/signin");
  };

  useEffect(() => {
    if (isAuth && authType !== "oauth") {
      const element = document.getElementById("header");
      element.style.position = "unset";
    }
  });
  return (
    <div className="navbar-wrapper" id="header">
      <nav className="navbar navbar-light">
        <Link className="navbar-brand" to="/">
          Chatter.{" "}
          <span
            style={{ fontStyle: "italic", fontWeight: 100, fontSize: "20px" }}
          >
            Alpha
          </span>
        </Link>
        {isAuth && authType !== "oauth" ? (
          <ul className="nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/signout" onClick={signOut}>
                Sign Out
              </Link>
            </li>
          </ul>
        ) : null}
        {/* <ul className="nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/signup">
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signin">
              Sign In
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signout">
              Sign Out
            </Link>
          </li>
        </ul> */}
      </nav>
    </div>
  );
};

export default Header;

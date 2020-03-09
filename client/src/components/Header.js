import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "../css/Header.css";

const Header = props => {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const authType = useSelector(state => state.auth.authType);

  return (
    <>
      {isAuth && authType !== "oauth" ? null : (
        <div className="navbar-wrapper" id="header">
          <nav className="navbar navbar-light main-nav">
            <Link className="navbar-brand" to="/" id="brand-logo">
              Chatter.{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 100,
                  fontSize: "20px"
                }}
              >
                Alpha
              </span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;

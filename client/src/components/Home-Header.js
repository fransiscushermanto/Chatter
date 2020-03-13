import React, { useEffect, useState, useRef } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "react-avatar";
import "../css/Home-Header.css";
import * as actions from "../actions";

const HomeHeader = props => {
  const dispatch = useDispatch();
  let { url } = useRouteMatch();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const authType = useSelector(state => state.auth.authType);
  const jwtToken = useSelector(state => state.auth.token);
  const dataUser = useSelector(state => state.decode.user);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  function detectOnBlur(ref) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (open === true) {
          handleClick();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }

  useEffect(() => {
    detectOnBlur(wrapperRef);
  }, [wrapperRef, open]);

  const signOut = () => {
    dispatch(actions.signOut());
    window.location.replace("/signin");
  };

  useEffect(() => {
    const decodedata = async data => {
      await dispatch(actions.decodeJWT(data));
    };
    if (isAuth && authType !== "oauth") {
      const element = document.getElementById("header");
      element.style.position = "unset";
      const brandLogo = document.getElementById("brand-logo");
      brandLogo.setAttribute("style", "font-size: 30px !important");
      decodedata(jwtToken);
    }
  }, [isAuth, authType, dispatch, jwtToken]);

  const setInitialProfilePicture = () => {
    const data = dataUser;
    var fullname;
    if (data.method === "local") {
      fullname = data.local.fullname;
    } else if (data.method === "facebook") {
      fullname = data.facebook.fullname;
    } else {
      fullname = data.google.fullname;
    }

    return fullname;
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const renderAvatar = size => (
    <Avatar
      round="50px"
      size={size}
      name={setInitialProfilePicture()}
      className="profile-avatar"
      style={{ marginRight: "10px" }}
      onClick={() => handleClick()}
      maxInitials={2}
    />
  );

  const renderProfileMenu = () => {
    const data = dataUser;
    var fullname;
    if (data.method === "local") {
      fullname = data.local.fullname;
    } else if (data.method === "facebook") {
      fullname = data.facebook.fullname;
    } else {
      fullname = data.google.fullname;
    }

    return (
      <div className="profile-nav-wrapper">
        <nav className="profile-nav">
          <ul className="nav">
            <li className="nav-item">
              <div className="header-profile-nav">
                <Link to="/profile">
                  <Avatar
                    round="50px"
                    size="35px"
                    name={setInitialProfilePicture()}
                    className="profile-avatar"
                    style={{ marginRight: "10px" }}
                    maxInitials={2}
                  />
                </Link>
                <div className="displayName">
                  <div className="inner-displayName">
                    <span>{fullname}</span>
                  </div>
                </div>
              </div>
            </li>
            <hr className="nav-item-separator" />
            <li className="nav-item nav-profile-item">
              <Link
                className="nav-link"
                to={`${url}/addFriend`}
                onClick={() => handleClick()}
              >
                <i
                  className="fas fa-user-plus"
                  style={{ marginRight: "10px" }}
                ></i>
                Add Friend
              </Link>
            </li>
            <hr className="nav-item-separator" />
            <li className="nav-item nav-profile-item">
              <Link className="nav-link" to="/signout" onClick={signOut}>
                <i
                  className="fas fa-power-off"
                  style={{ marginRight: "10px" }}
                ></i>
                <span>Sign Out</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  useEffect(() => {
    if (dataUser !== "") {
      setInitialProfilePicture();
    }
  }, [dataUser]);

  return (
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
        {isAuth && authType !== "oauth" ? (
          <ul className="nav nav-wrapper" ref={wrapperRef}>
            {dataUser ? (
              <li className="nav-item">{renderAvatar("40px")}</li>
            ) : null}
            {open ? renderProfileMenu() : null}
          </ul>
        ) : null}
      </nav>
    </div>
  );
};

export default HomeHeader;

import React, { useEffect, useState, useRef } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "react-avatar";
import "../css/Home-Header.css";
import * as actions from "../actions";

const HomeHeader = ({ profileName, renderProfile }) => {
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

  const handleClick = () => {
    setOpen(!open);
  };

  const showProfile = () => {
    setOpen(!open);
    renderProfile(profileName);
  };

  const renderAvatar = size => (
    <Avatar
      round="50px"
      size={size}
      name={profileName}
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
                <Link to={`${url}?name=You`} onClick={() => showProfile()}>
                  <Avatar
                    round="50px"
                    size="35px"
                    name={profileName}
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
                <svg
                  style={{ marginRight: "10px" }}
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="user-plus"
                  className="svg-inline--fa fa-user-plus fa-w-20"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                  ></path>
                </svg>
                Add Friend
              </Link>
            </li>
            <hr className="nav-item-separator" />
            <li className="nav-item nav-profile-item">
              <Link className="nav-link" to="/signout" onClick={signOut}>
                <svg
                  style={{ marginRight: "10px" }}
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="power-off"
                  className="svg-inline--fa fa-power-off fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"
                  ></path>
                </svg>
                <span>Sign Out</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

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

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "react-avatar";
import "../css/Home-Header.css";
import * as actions from "../actions";

const HomeHeader = props => {
  const dispatch = useDispatch();
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

  const color = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF"
  ];

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
      console.log(brandLogo);
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
      color={Avatar.getRandomColor("sitebase", color)}
      name={setInitialProfilePicture()}
      className="profile-avatar"
      style={{ marginRight: "10px" }}
      onClick={() => handleClick()}
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
                    color={Avatar.getRandomColor("sitebase", color)}
                    name={setInitialProfilePicture()}
                    className="profile-avatar"
                    style={{ marginRight: "10px" }}
                  />
                </Link>
                <span>{fullname}</span>
              </div>
            </li>
            <hr className="nav-item-separator" />
            <li className="nav-item nav-profile-item">
              <Link className="nav-link" to="/signout" onClick={signOut}>
                Sign Out
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

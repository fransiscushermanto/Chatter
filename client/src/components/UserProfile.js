import React from "react";
import { useLocation, Link } from "react-router-dom";

import Avatar from "./CustomAvatar";

import "../css/UserProfile.css";
const UserProfile = ({ profile, onClick, checkFriend, createChatRoom }) => {
  let query = new URLSearchParams(useLocation().search);
  const displayName = query.get("name") === "You" ? profile : query.get("name");

  return (
    <div className="userProfile-container">
      <div className="userProfile-wrapper">
        <div className="closebutton">
          <div className="close-container">
            <Link to={"/home"} onClick={() => onClick()}>
              <div className="wrapperbutton">
                <div className="leftright"></div>
                <div className="rightleft"></div>
              </div>
              <label className="close">close</label>
            </Link>
          </div>
        </div>
        <div className="inner-userProfile-wrapper">
          <Avatar size="130px" round="130px" displayName={displayName}></Avatar>
          <div className="profileDetail-wrapper">
            <div className="displayName-wrapper">
              {displayName ? (
                <div className="displayName-field">{displayName}</div>
              ) : null}
            </div>
            {query.get("name") !== "You" ? (
              <div className="btnaction-wrapper">
                <button
                  className="start-chat"
                  onClick={() => createChatRoom(profile)}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="comment"
                    className="svg-inline--fa fa-comment fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"
                    ></path>
                  </svg>
                  <span className="tooltip-text">Start a chat</span>
                </button>
                <button className="block">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="ban"
                    className="svg-inline--fa fa-ban fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"
                    ></path>
                  </svg>
                  <span className="tooltip-text">Block</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

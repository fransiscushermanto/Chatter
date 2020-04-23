import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Avatar from "./CustomAvatar";

import "../css/UserProfile.css";
const UserProfile = ({
  profile,
  onClick,
  createChatRoom,
  setOpenUnblockModal,
  setOpenBlockModal,
  isFriend,
}) => {
  let query = new URLSearchParams(useLocation().search);
  const displayName = query.get("name") === "You" ? profile : query.get("name");
  const [friend, setFriend] = useState("");
  useEffect(() => {
    setFriend(
      isFriend(profile._id).length > 0 ? isFriend(profile._id)[0].status : null
    );
  }, []);

  const onBlock = () => {
    setFriend("block");
    setOpenBlockModal(true);
  };

  const onUnBlock = () => {
    setFriend("none");
    setOpenUnblockModal(true);
  };
  return displayName ? (
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
                    id="Layer_1"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <defs></defs>

                    <path
                      style={{ fill: "#141f38" }}
                      className="cls-1"
                      d="M275.69,98.46a6.56,6.56,0,0,0-6.56-6.56H85.33a6.56,6.56,0,0,0,0,13.13H269.13A6.56,6.56,0,0,0,275.69,98.46Z"
                    />
                    <path
                      style={{ fill: "#141f38" }}
                      className="cls-1"
                      d="M164.1,144.41H85.33a6.56,6.56,0,0,0,0,13.13H164.1a6.56,6.56,0,1,0,0-13.13Z"
                    />
                    <path
                      style={{ fill: "#141f38" }}
                      className="cls-1"
                      d="M426.67,301.95H242.87a6.56,6.56,0,0,0,0,13.13H426.67a6.56,6.56,0,0,0,0-13.13Z"
                    />
                    <path
                      style={{ fill: "#141f38" }}
                      className="cls-1"
                      d="M439.79,210H346.56a71.75,71.75,0,0,0,7.9-32.82v-105A72.29,72.29,0,0,0,282.26,0h-210A72.29,72.29,0,0,0,0,72.21v105a72.43,72.43,0,0,0,52.51,69.48v48.67A6.57,6.57,0,0,0,63.72,300l50.59-50.59h51.13a71.78,71.78,0,0,0-7.9,32.82v105a72.29,72.29,0,0,0,72.2,72.21h168l50.59,50.59a6.57,6.57,0,0,0,11.21-4.64V456.76A72.43,72.43,0,0,0,512,387.28v-105A72.29,72.29,0,0,0,439.79,210Zm-328.2,26.26a6.56,6.56,0,0,0-4.64,1.92L65.64,279.54v-38a6.56,6.56,0,0,0-5.26-6.43,59.23,59.23,0,0,1-47.25-57.89v-105A59.14,59.14,0,0,1,72.21,13.13h210a59.14,59.14,0,0,1,59.07,59.08v105a58.71,58.71,0,0,1-10,32.82,59.54,59.54,0,0,1-12,13.13,58.77,58.77,0,0,1-37.08,13.13H111.59Zm387.28,151a59.22,59.22,0,0,1-47.25,57.89,6.57,6.57,0,0,0-5.26,6.44v38L405,448.28a6.56,6.56,0,0,0-4.64-1.92H229.74a59.14,59.14,0,0,1-59.07-59.08v-105a58.71,58.71,0,0,1,10-32.82H282.26a72.07,72.07,0,0,0,55.65-26.26H439.79a59.14,59.14,0,0,1,59.08,59.08Z"
                    />
                    <path
                      style={{ fill: "#141f38" }}
                      className="cls-1"
                      d="M321.64,354.46H242.87a6.56,6.56,0,1,0,0,13.13h78.77a6.56,6.56,0,1,0,0-13.13Z"
                    />
                  </svg>
                  <span className="tooltip-text">Start a chat</span>
                </button>
                <button
                  className="block"
                  onClick={() => {
                    friend !== "block" ? onBlock() : onUnBlock();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      style={
                        friend !== "block"
                          ? { fill: "rgba(255,0,0,0.9)" }
                          : { fill: "rgba(15, 157, 88, 1)" }
                      }
                      d="M12 2.8c-5.3 0-9.7 4.3-9.7 9.7s4.3 9.7 9.7 9.7 9.7-4.3 9.7-9.7-4.4-9.7-9.7-9.7zm-7.3 9.7c0-4 3.3-7.3 7.3-7.3 1.6 0 3.1.5 4.3 1.4L6.1 16.8c-.9-1.2-1.4-2.7-1.4-4.3zm7.3 7.3c-1.6 0-3-.5-4.2-1.4L17.9 8.3c.9 1.2 1.4 2.6 1.4 4.2 0 4-3.3 7.3-7.3 7.3z"
                    ></path>
                  </svg>
                  <span className="tooltip-text">
                    {friend !== "block" ? "Block" : "Unblock"}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default UserProfile;

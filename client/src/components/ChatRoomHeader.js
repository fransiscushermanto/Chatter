import React, { useState, useRef, useEffect } from "react";
import Avatar from "./CustomAvatar";

import { detectOnBlur } from "./Factories";
const ChatRoomHeader = ({
  displayName,
  typing,
  onClick,
  data,
  friend,
  onClearMessages,
}) => {
  const menu = useRef(null);
  const [visibleMenu, setVisibleMenu] = useState(false);

  useEffect(() => {
    detectOnBlur(menu, visibleMenu, setVisibleMenu);
  }, [visibleMenu, menu]);

  const onVisible = () => {
    setVisibleMenu(!visibleMenu);
  };

  return (
    <div className="header-wrapper">
      <div className="inner-header-avatar">
        <div
          className="avatar"
          onClick={() => onClick({ data, friend })}
          role="button"
        >
          <Avatar size="50px" displayName={displayName} />
        </div>
      </div>
      <div className="inner-header-displayInfo">
        <div className="displayName-wrapper">
          <span>{displayName}</span>
        </div>
        <div className="displayStatus-wrapper">
          <span>{typing === true ? "Typing..." : null}</span>
        </div>
      </div>
      <div className="inner-header-button">
        <div
          className="user-info-icon"
          style={{ cursor: "pointer", position: "relative", height: "24px" }}
          onClick={onVisible}
          role="button"
          title="Menu"
          ref={menu}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="currentColor"
                d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
              ></path>
            </svg>
          </span>

          <span>
            {visibleMenu ? (
              <div
                id="context-menu"
                className="context-menu"
                style={{ position: "absolute", right: "10px", top: "30px" }}
              >
                <ul className="context-menu-wrapper">
                  <li className="context-menu-li">
                    <div
                      className="context-menu-item"
                      onClick={() => onClick({ data, friend })}
                      role="button"
                      title="User Info"
                    >
                      User Info
                    </div>
                  </li>
                  <li className="context-menu-li">
                    <div
                      className="context-menu-item"
                      role="button"
                      title="Clear Messages"
                      onClick={() => onClearMessages()}
                    >
                      Clear Messages
                    </div>
                  </li>
                </ul>
              </div>
            ) : null}
          </span>
        </div>

        {/* <span>btn</span>
        <span>btn</span> */}
      </div>
    </div>
  );
};

export default ChatRoomHeader;

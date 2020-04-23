import React, { useEffect, useState, useRef } from "react";

import { detectOnBlur } from "./Factories";
const ChatRoomMain = ({
  renderAllChat,
  onClearMessages,
  onClick,
  data,
  friend,
}) => {
  const rootRef = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [visible, setVisibility] = useState(false);

  useEffect(() => {
    const parent = rootRef.current;

    if (!parent) {
      return;
    }

    const showMenu = (event) => {
      if (
        event.target.offsetParent.classList.value !==
          "inner-m-wrapper selectable-text tail" &&
        event.target.className !== "inner-m-wrapper selectable-text tail" &&
        event.target.className !== "inner-m-wrapper selectable-text " &&
        event.target.offsetParent.className !==
          "inner-m-wrapper selectable-text " &&
        event.target.className !== "selectable-text"
      ) {
        event.preventDefault();
        setVisibility(true);
        setX(event.clientX);
        setY(event.clientY);
      } else {
        setVisibility(false);
      }
    };

    parent.addEventListener("contextmenu", showMenu);

    return function cleanup() {
      parent.removeEventListener("contextmenu", showMenu);
    };
  }, []);

  useEffect(() => {
    detectOnBlur(rootRef, visible, setVisibility);
  }, [visible, rootRef]);

  const style = {
    top: y,
    left: x,
  };

  return (
    <div
      className="chat-display-wrapper"
      id="chat-window"
      onClick={() => setVisibility(false)}
      ref={rootRef}
    >
      {renderAllChat()}
      <span>
        {visible ? (
          <div id="context-menu" className="context-menu" style={style}>
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
                  onClick={() => onClearMessages()}
                  title="Clear Messages"
                >
                  Clear Messages
                </div>
              </li>
            </ul>
          </div>
        ) : null}
      </span>
    </div>
  );
};

export default ChatRoomMain;

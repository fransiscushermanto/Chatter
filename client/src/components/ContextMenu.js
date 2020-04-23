import React, { useState } from "react";
import { useEffect } from "react";

import { detectOnBlur } from "./Factories";
const ContextMenu = ({
  data,
  read,
  rootRef,
  visible,
  setVisibility,
  setOpenDeleteRoomModal,
  setChatRoomData,
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const parent = rootRef.current;
    if (!parent) {
      return;
    }

    const showMenu = (event) => {
      event.preventDefault();
      console.log(data);
      setVisibility(true);
      setX(event.clientX);
      setY(event.clientY);
    };

    parent.addEventListener("contextmenu", showMenu);

    return function cleanup() {
      parent.removeEventListener("contextmenu", showMenu);
    };
  }, []);

  useEffect(() => {
    detectOnBlur(rootRef, visible, setVisibility);
  }, [visible, rootRef]);

  const onDeleteCaution = () => {
    setChatRoomData(data);
    setOpenDeleteRoomModal(true);
  };

  const style = {
    top: y,
    left: x,
  };
  return visible ? (
    <div id="context-menu" className="context-menu" style={style}>
      <ul className="context-menu-wrapper">
        <li className="context-menu-li">
          <div
            className="context-menu-item"
            onClick={onDeleteCaution}
            role="button"
            title="Delete Chat"
          >
            Delete Chat
          </div>
        </li>
        <li className="context-menu-li">
          {read ? (
            <div
              className="context-menu-item"
              role="button"
              title="Mark as Unread"
            >
              Mark as Unread
            </div>
          ) : (
            <div
              className="context-menu-item"
              role="button"
              title="Mark as Read"
            >
              Mark as Read
            </div>
          )}
        </li>
      </ul>
    </div>
  ) : null;
};

export default ContextMenu;

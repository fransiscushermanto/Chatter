import React from "react";
import Avatar from "./CustomAvatar";

import "../css/ChatRoom.css";
const ChatRoom = props => {
  const { displayName, chat } = props;
  return (
    <div className="chat-room">
      <div className="header">
        <div className="header-wrapper">
          <div className="inner-header-avatar">
            <Avatar size="50px" displayName={displayName} />
          </div>
          <div className="inner-header-displayInfo">
            <span>{displayName}</span>
            <span>Last Seen 7 hours ago</span>
          </div>
          <div className="inner-header-button">
            <span>btn</span>
            <span>btn</span>
            <span>btn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

import React from "react";
import Avatar from "./CustomAvatar";

const ChatRoomHeader = ({ displayName }) => {
  return (
    <div className="header-wrapper">
      <div className="inner-header-avatar">
        <Avatar size="50px" displayName={displayName} />
      </div>
      <div className="inner-header-displayInfo">
        <div className="displayName-wrapper">
          <span>{displayName}</span>
        </div>
        <div className="displayStatus-wrapper">
          <span>Last seen 7 hours ago</span>
        </div>
      </div>
      <div className="inner-header-button">
        <span>btn</span>
        <span>btn</span>
        <span>btn</span>
      </div>
    </div>
  );
};

export default ChatRoomHeader;

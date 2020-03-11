import React from "react";
import PropTypes from "prop-types";

import Avatar from "./CustomAvatar";
import "../css/ChatDisplay.css";
const ChatDisplay = props => {
  const { onClick, displayName, chat, data } = props;
  return (
    <div className="cxroom" onClick={() => onClick(data)}>
      <Avatar size="40px" displayName={displayName} />
      <div className="displayer">
        <div className="display-name">
          <span>{displayName}</span>
        </div>
        <div className="display-chat">
          <div className="chat-item">
            <span>{chat[chat.length - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatDisplay.propTypes = {
  onClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  chat: PropTypes.array.isRequired
};

export default ChatDisplay;

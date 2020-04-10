import React from "react";

const ChatRoomMain = ({ renderAllChat }) => {
  return (
    <div className="chat-display-wrapper" id="chat-window">
      {renderAllChat()}
    </div>
  );
};

export default ChatRoomMain;

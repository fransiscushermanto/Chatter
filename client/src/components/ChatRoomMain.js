import React from "react";

const ChatRoomMain = ({ renderAllChat, scrolling }) => {
  return (
    <div className="chat-display-wrapper" id="chat-window">
      {renderAllChat()}
      <span>
        {scrolling ? (
          <div role="button" className="scrollBottom">
            <span className="unread"></span>
            <span className="arrow-down">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 21 21"
                width="21"
                height="21"
              >
                <path
                  fill="currentColor"
                  d="M4.8 6.1l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"
                ></path>
              </svg>
            </span>
          </div>
        ) : null}
      </span>
    </div>
  );
};

export default ChatRoomMain;

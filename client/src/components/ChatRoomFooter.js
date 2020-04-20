import React from "react";
import ContentEditable from "react-contenteditable";

const ChatRoomFooter = ({
  handleSendChat,
  handleChange,
  disableNewLines,
  pastePlainText,
  handleTyping,
  message,
  visible,
  friend,
}) => {
  return friend === "block" ? (
    <div className="footer-wrapper" style={{ justifyContent: "center" }}>
      <span>Can't Send Message to Blocked User</span>
    </div>
  ) : (
    <div className="footer-wrapper">
      <div className="icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
        >
          <path
            fill="currentColor"
            d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
          ></path>
        </svg>
      </div>
      <div tabIndex="-1" className="input-message-bar">
        <div
          className="inner-input-message"
          tabIndex="-1"
          onKeyDown={(e) =>
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
              navigator.userAgent
            )
              ? handleSendChat(e)
              : null
          }
        >
          <div
            className="placeholder"
            style={visible ? { visibility: visible } : { visibility: "hidden" }}
          >
            Type a message
          </div>
          <ContentEditable
            disabled={friend === "block" ? true : false}
            className="input-bar"
            id="message-bar"
            spellCheck="true"
            onKeyUp={handleTyping}
            onKeyPress={disableNewLines}
            html={message}
            onPaste={pastePlainText}
            onChange={handleChange}
          ></ContentEditable>
        </div>
      </div>
      <div className="icon-wrapper">
        <button onClick={handleSendChat}>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="paper-plane"
            className="paper-plane"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoomFooter;

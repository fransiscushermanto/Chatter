import React, { useEffect, useRef, useState } from "react";
import Avatar from "./CustomAvatar";
import { useForm } from "react-hook-form";

import "../css/ChatRoom.css";
const ChatRoom = props => {
  const [visible, setVisible] = useState(false);

  const { handleSubmit, register } = useForm();
  const { displayName, chat, onSubmit } = props;
  const prevScrollY = useRef(0);

  const renderAllChat = () => {
    let currentStatus;
    let changeStatus = false;
    return chat.map((item, index) => {
      if (currentStatus === item.status && changeStatus !== undefined) {
        changeStatus = false;
      } else {
        changeStatus = true;
      }

      if (item.status === "in") {
        currentStatus = "in";
        return ChatInComp(item.message, index, changeStatus);
      } else {
        currentStatus = "out";
        return ChatOutComp(item.message, index, changeStatus);
      }
    });
  };

  const ChatInComp = (item, index, status) => {
    return (
      <div
        key={index}
        className="comp-messageIn m-wrapper"
        style={status ? { marginTop: "5px" } : null}
      >
        <div className="inner-m-wrapper">
          <span className="messageIn">{item}</span>
        </div>
      </div>
    );
  };

  const ChatOutComp = (item, index, status) => {
    return (
      <div
        key={index}
        className="comp-messageOut m-wrapper"
        style={status ? { marginTop: "5px" } : null}
      >
        <div className="inner-m-wrapper">
          <span className="messageOut">{item}</span>
        </div>
      </div>
    );
  };

  const scrollBottom = () => {
    var windows = document.getElementById("chat-window");
    windows.scrollTop = windows.scrollHeight;
  };

  useEffect(() => {
    scrollBottom();
  }, []);

  return (
    <div className="chat-room">
      <div className="header">
        <div className="header-wrapper">
          <div className="inner-header-avatar">
            <Avatar size="50px" displayName={displayName} />
          </div>
          <div className="inner-header-displayInfo">
            <div className="displayName-wrapper">
              <span>{displayName}</span>
            </div>
            <div className="displayStatus-wrappe">
              <span>Last Seen 7 hours ago</span>
            </div>
          </div>
          <div className="inner-header-button">
            <span>btn</span>
            <span>btn</span>
            <span>btn</span>
          </div>
        </div>
      </div>
      <div className="main-chat-room">
        <div className="chat-display-wrapper" id="chat-window">
          {renderAllChat()}
        </div>
      </div>
      <div className="footer">
        <div className="footer-wrapper">
          <div className="icon-wrapper">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="smile"
              className="svg-inline--fa fa-smile fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                fill="currentColor"
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
              ></path>
            </svg>
          </div>
          <div className="input-message-bar">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                name="message"
                className="form-control"
                id="message-bar"
                placeholder="Type a message"
                autoComplete="off"
                ref={register}
              />
            </form>
          </div>
          <div className="icon-wrapper">
            <button onClick={handleSubmit(onSubmit)}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="paper-plane"
                className="svg-inline--fa fa-paper-plane fa-w-16"
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
      </div>
    </div>
  );
};

export default ChatRoom;

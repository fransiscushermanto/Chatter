import React, { useEffect, useRef, useState, useReducer } from "react";
import Avatar from "./CustomAvatar";

import axios from "../instance";
import "../css/ChatRoom.css";

const initialState = {
  chat: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return { ...state, chat: action.payload };
    default:
      return state;
  }
};

const ChatRoom = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [visible, setVisible] = useState(true);
  const [chatContainer, setChatContainer] = useState([]);

  const height = useRef(0);
  const count = useRef(0);
  const ctrl = useRef(false);
  const {
    displayName,
    room_id,
    status,
    friend_id,
    user,
    socket,
    unreadMessage,
    user_id,
    userName
  } = props;
  const prevScrollY = useRef(0);

  const setStatetoChatContainer = () => {
    let arr = [];
    state.chat.map(data => {
      arr.push(data);
    });
    setChatContainer(arr);
  };

  const loadChat = async () => {
    const data = {
      room_id,
      user
    };
    const res = await axios.post("/chats/loadAllChat", data);
    dispatch({
      type: "LOAD",
      payload: res.data.chat
    });
    localStorage.setItem("JWT_TOKEN", res.data.token);
  };

  const sendChat = async data => {
    const res = await axios.post("/chats/sendChat", data);
    localStorage.setItem("JWT_TOKEN", res.data.token);
  };

  const dateSeperator = date => {
    date = date.split(",");

    const now = new Date();
    const arrMonth = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "Desember"
    ];
    const arrDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    if (
      Number.parseInt(date[1]) === now.getDate() &&
      Number.parseInt(date[2]) === now.getMonth() + 1 &&
      Number.parseInt(date[3]) === now.getFullYear()
    ) {
      return "Today";
    } else {
      return `${arrDay[date[0]]}, ${date[1]} ${arrMonth[date[2] - 1]} ${
        date[3]
      }`;
    }
  };

  const onSendChat = e => {
    const messagebar = document.getElementById("message-bar");
    const restrictedKey = {
      91: true, //Win Key
      92: true, //Win Key
      93: true, //Context Menu
      144: true, //Num Lock
      145: true, //Scroll Lock
      112: true, //F1
      113: true, //F2
      114: true, //F3
      115: true, //F4
      116: true, //F5
      117: true, //F6
      118: true, //F7
      119: true, //F8
      120: true, //F9
      121: true, //F10
      122: true, //F11
      123: true //F12
    };
    if (e.keyCode === 13 && e.shiftKey) {
      setVisible(false);
      count.current++;
      height.current = messagebar.offsetHeight;
      if (messagebar.offsetHeight > 20) {
        height.current = messagebar.offsetHeight;
      }
    } else if (e.keyCode === 13 || e.keyCode === undefined) {
      e.preventDefault();
      if (messagebar.innerHTML !== "") {
        let date = new Date(Date.now());
        let message = messagebar.innerHTML;
        let data = {
          room_id: room_id,
          chat: message,
          sender_id: user_id,
          time: date,
          status: "unread",
          user: user,
          friend_id: friend_id
        };
        sendChat(data);
        socket.emit("SEND_MESSAGE", { room: room_id, data });
        messagebar.innerHTML = "";
        setVisible(true);
      }
    } else if (e.ctrlKey && e.keyCode === 65) {
      ctrl.current = true;
    } else if (e.keyCode === 8) {
      console.log("height", height.current, messagebar.offsetHeight);
      console.log("length", messagebar.innerHTML.length - 1);
      console.log("count", count.current);
      if (ctrl.current) {
        setVisible(true);
        count.current = 0;
        ctrl.current = false;
        return;
      }

      if (height.current > 20) {
        if (
          height.current === 40 &&
          messagebar.offsetHeight === 20 &&
          messagebar.innerHTML.length - 1 > 0
        ) {
          setVisible(false);
        } else if (messagebar.innerHTML.length - 1 > 1) {
          console.log("NOT VISIBLE");
          setVisible(false);
        } else {
          height.current = messagebar.offsetHeight;
          setVisible(true);
          count.current = 0;
        }
      } else if (height.current === 0 || height.current === 20) {
        if (
          height.current === 20 &&
          messagebar.offsetHeight === 40 &&
          messagebar.innerHTML.length - 1 > 0
        ) {
          setVisible(false);
        } else if (height.current === 20 && messagebar.offsetHeight === 40) {
          setVisible(true);
          count.current = 0;
        } else if (
          height.current === 20 &&
          messagebar.offsetHeight === 20 &&
          count.current === 1 &&
          messagebar.innerHTML.length - 1 === 1
        ) {
          setVisible(true);
          count.current = 0;
        } else if (messagebar.innerHTML.length - 1 > 0) {
          console.log("ASDe");
          setVisible(false);
        } else {
          console.log("ASD");
          setVisible(true);
          count.current = 0;
        }
      }
    } else if (messagebar.innerHTML.length - 1 > 0) {
      setVisible(false);
    } else if (e.keyCode >= 48 && restrictedKey[e.keyCode] === undefined) {
      setVisible(false);
    }
  };
  const tConvert = time => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  const renderAllChat = () => {
    let currentStatus,
      newMessageStatus = true;
    let changeStatus = true;
    let datestatus,
      changeDate = false;
    return chatContainer.map((item, index) => {
      console.log("sender", item.sender_id);
      console.log("friend", friend_id);
      console.log("user", user_id);
      if (item.sender_id === friend_id || item.sender_id === user_id) {
        if (item.sender_id === currentStatus && changeStatus !== undefined) {
          changeStatus = false;
        } else {
          changeStatus = true;
        }

        const temp = new Date(item.time);
        var chatTime = `${temp.getHours()}:${
          temp.getMinutes().toString().length > 1 ? "" : 0
        }${temp.getMinutes()}`;
        var chatDate = `${temp.getDay()},${temp.getDate()},${temp.getMonth() +
          1},${temp.getFullYear()}`;

        if (index === 0) {
          datestatus = chatDate;
          changeDate = true;
        } else if (datestatus !== chatDate) {
          datestatus = chatDate;
          changeDate = true;
        } else if (datestatus === chatDate) {
          datestatus = chatDate;
          changeDate = false;
        }
        if (item.sender_id !== user._id) {
          currentStatus = item.sender_id;
          return (
            <div key={index}>
              {changeDate ? (
                <div className="chatroom-date-sep m-wrapper">
                  <div className="inner-date-sep">
                    <span>{dateSeperator(chatDate)}</span>
                  </div>
                </div>
              ) : null}
              {unreadMessage > 0 ? (
                newMessageStatus ? (
                  <div className="unread-notif">
                    {(newMessageStatus = false)}
                    <span>{unreadMessage} UNREAD MESSAGES</span>
                  </div>
                ) : null
              ) : null}
              {ChatInComp(item.chat, index, changeStatus, chatTime)}
            </div>
          );
        } else {
          currentStatus = item.sender_id;
          return (
            <div key={index}>
              {changeDate ? (
                <div className="chatroom-date-sep m-wrapper">
                  <div className="inner-date-sep">
                    <span>{dateSeperator(chatDate)}</span>
                  </div>
                </div>
              ) : null}
              {ChatOutComp(
                item.chat,
                index,
                changeStatus,
                chatTime,
                item.status
              )}
            </div>
          );
        }
      }
    });
  };

  const ChatInComp = (item, index, status, time) => {
    return (
      <div
        key={index}
        className="comp-messageIn m-wrapper"
        style={status ? { marginTop: "5px" } : null}
      >
        <div
          className={
            !status
              ? "inner-m-wrapper selectable-text "
              : "inner-m-wrapper selectable-text tail"
          }
        >
          <span className="messageIn">
            <span>{item}</span>
          </span>
        </div>
        <div className="time-wrapper">
          <span className="time">
            <span>{tConvert(time)}</span>
          </span>
        </div>
      </div>
    );
  };

  const ChatOutComp = (item, index, status, time, read) => {
    return (
      <div
        key={index}
        className="comp-messageOut m-wrapper"
        style={status ? { marginTop: "5px" } : null}
      >
        <div className="time-wrapper">
          <span className="time">
            <span>{read === "read" ? "Read" : ""}</span>
            <span>{tConvert(time)}</span>
          </span>
        </div>
        <div
          className={
            !status
              ? "inner-m-wrapper selectable-text "
              : "inner-m-wrapper selectable-text tail"
          }
        >
          <span className="messageOut">
            <span>{item}</span>
          </span>
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
    loadChat();
    socket.emit("JOIN_ROOM", { room: room_id });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    if (state.chat.length > 0) {
      setStatetoChatContainer();
    }
  }, [state]);

  socket.on("RECEIVE_MESSAGE", message => {
    setChatContainer([...chatContainer, message.data]);
  });

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
        {status === "off" ? (
          <div className="alert-status-wrapper">
            <div className="inner-alert-status">
              <div className="action-btn">
                <button>ADD</button>
                <div className="line"></div>
                <button>BLOCK</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="main-chat-room">
        <div className="chat-display-wrapper" id="chat-window">
          {renderAllChat()}
        </div>
      </div>
      <footer className="footer">
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
          <div tabIndex="-1" className="input-message-bar">
            <div
              className="inner-input-message"
              onKeyDown={onSendChat}
              tabIndex="-1"
            >
              <div
                className="placeholder"
                style={
                  visible ? { visibility: visible } : { visibility: "hidden" }
                }
              >
                Type a message
              </div>
              <div
                type="text"
                name="message"
                className="input-bar"
                id="message-bar"
                placeholder="Type a message"
                autoComplete="off"
                contentEditable={true}
                dir="ltr"
                spellCheck="true"
              ></div>
            </div>
          </div>
          <div className="icon-wrapper">
            <button onClick={onSendChat}>
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
      </footer>
    </div>
  );
};

export default ChatRoom;

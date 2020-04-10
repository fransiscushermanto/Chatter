import React, { useEffect, useRef, useState, useReducer } from "react";

import ChatRoomFooter from "./ChatRoomFooter";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatRoomMain from "./ChatRoomMain";

import axios from "../instance";
import "../css/ChatRoom.css";

const initialState = {
  chat: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return { ...state, chat: action.payload };
    default:
      return state;
  }
};

const ChatRoom = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [visible, setVisible] = useState(true);
  const [chatContainer, setChatContainer] = useState([]);
  const [message, setMessage] = useState("");

  const {
    displayName,
    room_id,
    status,
    friend_id,
    user,
    socket,
    unreadMessage,
    user_id,
    userName,
    updateState,
  } = props;

  const chatContainerRef = useRef([]);
  const setStatetoChatContainer = () => {
    if (chatContainer.length === 0) {
      setChatContainer(...chatContainer, state.chat);
    } else {
      setChatContainer(state.chat);
    }
  };

  const loadChat = async (length = 0) => {
    let skip = 0;
    skip += length;
    console.log(state.chat.length, skip);
    if (state.chat.length >= 30) {
      skip = state;
    }

    const data = {
      room_id,
      user,
      skip,
    };
    const res = await axios.post("/chats/loadAllChat", data);

    dispatch({
      type: "LOAD",
      payload: res.data.chat,
    });
    console.log("Loading...");
    localStorage.setItem("JWT_TOKEN", res.data.token);
  };

  const updateChat = async () => {
    console.log("Updating...");
    const data = {
      room_id,
      sender_id: friend_id,
    };
    const res = await axios.post("/chats/updateChatReadStatus", data);
    if (res.data.message) {
      loadChat();
    }
  };

  const handleSendChat = () => {
    let date = new Date(Date.now());
    let data = {
      room_id: room_id,
      chat: message,
      sender_id: user_id,
      time: date,
      status: "unread",
      user: user,
      friend_id: friend_id,
    };
    socket.emit("SEND_MESSAGE", { room: room_id, data }, () => setMessage(""));
    setVisible(true);
  };

  const dateSeperator = (date) => {
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
      "Desember",
    ];
    const arrDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
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

  const pastePlainText = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  const disableNewLines = (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13 && e.shiftKey) {
      setVisible(false);
    } else if (keyCode === 13) {
      e.returnValue = false;
      if (e.preventDefault) {
        e.preventDefault();
      }
    } else {
      e.returnValue = true;
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value.trim());
    if (e.target.value.trim().length > 0) {
      setVisible(false);
    }

    if (e.target.value === "<br>") {
      setVisible(true);
      setMessage("");
    }

    if (e.target.value.length > 0) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    if (
      (e.target.value.length === 1 && e.target.value.trim() === "") ||
      (e.target.value.length === 4 && e.target.value.trim() === "<br>")
    ) {
      setVisible(true);
    }
  };

  const tConvert = (time) => {
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
    return chatContainer
      .sort(function (a, b) {
        var tA = new Date(a.time);
        var tB = new Date(b.time);
        if (tA < tB) return -1;
        if (tA > tB) return 1;
        return 0;
      })
      .map((item, index) => {
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
          var chatDate = `${temp.getDay()},${temp.getDate()},${
            temp.getMonth() + 1
          },${temp.getFullYear()}`;

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
                {item.status === "unread"
                  ? console.log(item.status, unreadMessage)
                  : null}
                {item.status === "unread" ? (
                  unreadMessage > 0 ? (
                    newMessageStatus ? (
                      <div className="unread-notif">
                        {(newMessageStatus = false)}
                        <span>{unreadMessage} UNREAD MESSAGES</span>
                      </div>
                    ) : null
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
    updateChat();
    loadChat();
    console.log(status);
    socket.emit("ENTER_ROOM", { room: room_id, user: user_id });
    document
      .getElementById("chat-window")
      .addEventListener("scroll", function () {
        if (this.scrollTop === 0) {
          console.log(
            chatContainerRef.current.length,
            chatContainerRef.current
          );
          // if (chatContainerRef.current.length >= 30) {
          //   loadChat(30);
          // }
        }
      });
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

  useEffect(() => {
    if (message.trim().length === 4 && message.trim() === "<br>") {
      setMessage("");
      setVisible(true);
    }
  }, [message]);

  useEffect(() => {
    chatContainerRef.current = chatContainer;
    socket.on("REPREPARE_ROOM", async (data) => {
      if (data.user !== user_id) {
        await updateChat();
        console.log("Repreparing...");
        loadChat();
      }
    });
    socket.on("RECEIVE_MESSAGE", (message) => {
      if (message.data.sender_id !== user_id) {
        socket.emit("UPDATE_MESSAGE", { room: room_id }, () => updateChat());
        loadChat();
      } else {
        setChatContainer([...chatContainer, message.data]);
      }

      scrollBottom();
    });
    socket.on("REFRESH_MESSAGE", () => {
      console.log("Refreshing...");
      loadChat();
    });

    if (chatContainer.length <= 30) {
      scrollBottom();
    }
    console.log(chatContainer);
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [chatContainer]);

  return (
    <div className="chat-room">
      <div className="header">
        <ChatRoomHeader displayName={displayName}></ChatRoomHeader>
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
        <ChatRoomMain renderAllChat={renderAllChat}></ChatRoomMain>
      </div>
      <footer className="footer">
        <ChatRoomFooter
          handleChange={handleChange}
          handleSendChat={handleSendChat}
          message={message}
          visible={visible}
          pastePlainText={pastePlainText}
          disableNewLines={disableNewLines}
        ></ChatRoomFooter>
      </footer>
    </div>
  );
};

export default ChatRoom;

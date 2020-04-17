import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch } from "react-redux";

import ChatRoomFooter from "./ChatRoomFooter";
import ChatRoomHeader from "./ChatRoomHeader";
import ChatRoomMain from "./ChatRoomMain";

import * as actions from "../actions";
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
  const [state, dispatcher] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState(true);
  const [chatContainer, setChatContainer] = useState([]);
  const [message, setMessage] = useState("");
  const [scrolling, setScrolling] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const {
    displayName,
    room_id,
    status,
    friend_id,
    user,
    socket,
    unreadMessage,
    user_id,
    chats,
  } = props;

  const position = useRef();
  const dispatch = useDispatch();
  const setStatetoChatContainer = () => {
    const res = chats.filter((data) => data.room_id.includes(room_id));

    if (chatContainer.length === 0) {
      setChatContainer(...chatContainer, res);
    } else {
      setChatContainer(res);
    }
  };

  const loadChat = async () => {
    const data = {
      room_id,
      user,
      skip: 0,
    };
    const res = await axios.post("/chats/loadAllChat", data);

    dispatcher({
      type: "LOAD",
      payload: res.data.chat,
    });
    console.log("Loading...");
    localStorage.setItem("JWT_TOKEN", res.data.token);
  };

  const updateChat = async (data) => {
    console.log("UPDATING");
    const sent = {
      room_id,
      sender_id: data,
    };
    await axios.post("/chats/updateChatReadStatus", sent);
  };

  function escapeHtml(text) {
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }

  const handleSendChat = () => {
    let date = new Date(Date.now());

    let data = {
      room_id: room_id,
      chat: escapeHtml(message),
      sender_id: user_id,
      time: date,
      status: "unread",
      user: user,
      friend_id: friend_id,
    };

    if (unreadMessage > 0) {
      setFirstLoad(false);
    }

    if (scrolling) {
      setScrolling(false);
    }

    socket.emit("SEND_MESSAGE", { room: room_id, data }, () => {
      setMessage("");
      setVisible(true);
    });
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
                {scrolling === false && firstLoad === true ? (
                  item.status === "unread" ? (
                    unreadMessage > 0 ? (
                      newMessageStatus ? (
                        <div className="unread-notif">
                          {(newMessageStatus = false)}
                          <span>{unreadMessage} UNREAD MESSAGES</span>
                        </div>
                      ) : null
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

  const MessageHandler = (message) => {
    if (!scrolling) {
      setFirstLoad(false);
    }

    if (
      (!scrolling && position.current === undefined) ||
      (!scrolling && position.current === 0)
    ) {
      console.log("MES UP");
      socket.emit(
        "INROOM_UPDATE_MESSAGE",
        { room: room_id },
        async () => await updateChat(friend_id)
      );
    }
    setChatContainer([...chatContainer, message.data]);
  };

  const UpdateHandler = () => {
    socket.emit(
      "UPDATE_MESSAGE",
      { room: room_id },
      async () => await updateChat(friend_id)
    );
  };

  const scrollBottom = () => {
    var windows = document.getElementById("chat-window");
    if (!scrolling) {
      windows.scrollTop = windows.scrollHeight;
    }

    if (unreadMessage > 0 && position !== undefined && firstLoad) {
      console.log("NO UP");
      socket.emit(
        "UPDATE_MESSAGE",
        { room: room_id },
        async () => await updateChat(friend_id)
      );
    } else if (unreadMessage === 1 && !scrolling && !firstLoad) {
      console.log("MES 12UP");
      socket.emit(
        "INROOM_UPDATE_MESSAGE",
        { room: room_id },
        async () => await updateChat(friend_id)
      );
    }
  };

  const detectScroll = () => {
    var windows = document.getElementById("chat-window");
    windows.addEventListener("scroll", function () {
      if (
        Math.floor(this.scrollTop + this.offsetHeight) === this.scrollHeight
      ) {
        setScrolling(false);
        position.current =
          Math.floor(this.scrollTop + this.offsetHeight) - this.scrollHeight;
      } else {
        setScrolling(true);
        position.current = Math.floor(this.scrollTop + this.offsetHeight);
      }
    });
  };

  const onAddFriend = async () => {
    const addFriendData = {
      friendId: friend_id,
      userId: user_id,
      user: user,
    };
    await dispatch(actions.addFriend(addFriendData));
    socket.emit("UPDATE_ROOM");
  };

  useEffect(() => {
    console.log(unreadMessage);
  }, [unreadMessage]);

  useEffect(() => {
    // document
    //   .getElementById("chat-window")
    //   .addEventListener("scroll", function () {
    //     if (this.scrollTop === 0) {
    //       // if (chatContainerRef.current.length >= 30) {
    //       //   loadChat(30);
    //       // }
    //     }
    //   });
    if (unreadMessage > 0) {
      socket.emit("PREPARING", {
        room: room_id,
      });
    }
  }, []);

  useEffect(() => {
    setStatetoChatContainer();
    // console.log(chats.filter((data) => data.room_id.includes(room_id)));
  }, [chats]);

  useEffect(() => {
    detectScroll();
    scrollBottom();
    return () => {
      detectScroll();
    };
  }, [scrolling]);

  useEffect(() => {
    if (message.trim().length === 4 && message.trim() === "<br>") {
      setMessage("");
      setVisible(true);
    }
  }, [message]);

  useEffect(() => {
    socket.on("REPREPARE_ROOM", UpdateHandler);
    return () => {
      socket.off("REPREPARE_ROOM", UpdateHandler);
    };
  }, []);

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", MessageHandler);
    scrollBottom();
    return () => {
      socket.off("RECEIVE_MESSAGE", MessageHandler);
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
                <button onClick={onAddFriend}>ADD</button>
                <div className="line"></div>
                <button>BLOCK</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="main-chat-room">
        <ChatRoomMain renderAllChat={renderAllChat}></ChatRoomMain>
        <span>
          {scrolling ? (
            <div
              role="button"
              className="scrollBottom"
              onClick={() => setScrolling(false)}
            >
              <span className="unread">
                {unreadMessage > 0 ? (
                  <span className="unread-marker">{unreadMessage}</span>
                ) : null}
              </span>
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

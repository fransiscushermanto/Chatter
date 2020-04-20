import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Avatar from "./CustomAvatar";
import ContextMenu from "./ContextMenu";
import "../css/ChatDisplay.css";

const ChatDisplay = (props) => {
  const {
    onClick,
    displayName,
    chat,
    time,
    data,
    unreadMessage,
    room_id,
    socket,
    setUnreadMessage,
    showChatRoom,
    setChatRoomData,
    setOpenDeleteRoomModal,
  } = props;

  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [unread, setUnread] = useState({ read: true, unread: 0 });
  const root = useRef(null);

  //DATE TIME FORMATTER
  const temp = new Date(time);
  var now = `${
    temp.getHours().toString().length > 1 ? "" : 0
  }${temp.getHours()}:${
    temp.getMinutes().toString().length > 1 ? "" : 0
  }${temp.getMinutes()}`;
  var chatDate = `${temp.getDay()},${temp.getDate()},${
    temp.getMonth() + 1
  },${temp.getFullYear()}`;
  var date = `${temp.getDate()},${temp.getMonth() + 1},${temp.getFullYear()}`;
  const tConvert = (time, date) => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
    date = date.split(",");
    const now = new Date();
    let interval;
    if (now.getFullYear() > Number.parseInt(date[2])) {
      interval = now.getFullYear() - Number.parseInt(date[2]);
      return `${interval} ${interval > 1 ? "years" : "year"} ago`;
    } else {
      if (now.getMonth() + 1 > Number.parseInt(date[1])) {
        interval = now.getMonth() + 1 - Number.parseInt(date[1]);
        return `${interval} ${interval > 1 ? "months" : "month"} ago`;
      } else {
        if (now.getDate() > Number.parseInt(date[0])) {
          interval = now.getDate() - Number.parseInt(date[0]);
          if (interval > 1) {
            return `${interval} days ago`;
          } else {
            return `Yesterday`;
          }
        }
      }
    }
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  useEffect(() => {
    if (unreadMessage.length > 0) {
      const thisRoomUnread = unreadMessage.filter((item) =>
        item.room_id.includes(room_id)
      )[0];

      data["unreadMessage"] = thisRoomUnread.unread;
      setUnread({ read: thisRoomUnread.read, unread: thisRoomUnread.unread });
    }
  }, [unreadMessage]);

  useEffect(() => {
    if (showChatRoom) {
      if (
        data.friend === "block" ||
        data.friend === "none" ||
        data.friend === null
      ) {
        onClick(data);
      }
    }

    socket.on("OPEN_CHAT_ROOM", (friend) => {
      if (data.friend_id === friend.friend_id) {
        console.log("TES");
        onClick(data);
      }
    });
    return () =>
      socket.off("OPEN_CHAT_ROOM", (friend) => {
        if (data.friend_id === friend.friend_id) {
          onClick(data);
        }
      });
  }, [data]);

  return (
    <div
      className="cxroom"
      id="cxroom"
      ref={root}
      onClick={() => {
        if (openContextMenu) {
          setOpenContextMenu(false);
        } else {
          onClick(data);
        }
      }}
    >
      <div className="avatar-wrapper">
        <Avatar size="40px" displayName={displayName} />
      </div>
      <div className="displayer">
        <div className="display-name">
          <div className="display-name-wrapper">
            <div className="inner-displayName">
              <span>{displayName}</span>
            </div>
          </div>
          <div className="display-time">
            {chat !== "" ? tConvert(now, date) : null}
          </div>
        </div>
        <div className="display-chat">
          <div className="chat-item">
            <div className="inner-chat-item" title={chat}>
              <span>{chat}</span>
            </div>
          </div>
          <div className="notif">
            <span>
              {!unread.read ? (
                <div
                  className="inner-notif"
                  style={
                    !unread.read ? { transform: "scaleX(1) scaleY(1)" } : null
                  }
                >
                  <span className="sum-notif">
                    {unread.unread === 0 ? "" : unread.unread}
                  </span>
                </div>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      <ContextMenu
        visible={openContextMenu}
        setVisibility={setOpenContextMenu}
        rootRef={root}
        data={data}
        read={unread.read}
        setOpenDeleteRoomModal={setOpenDeleteRoomModal}
        setChatRoomData={setChatRoomData}
      ></ContextMenu>
    </div>
  );
};

ChatDisplay.propTypes = {
  onClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  chat: PropTypes.string.isRequired,
};

export default ChatDisplay;

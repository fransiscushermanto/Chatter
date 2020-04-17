import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Avatar from "./CustomAvatar";
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
  } = props;
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
    data["unreadMessage"] = unreadMessage[room_id];
  }, [unreadMessage]);

  return (
    <div className="cxroom" onClick={() => onClick(data)}>
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
            <div className="inner-chat-item">
              <span>{chat}</span>
            </div>
          </div>
          <div className="notif">
            <span>
              {unreadMessage[room_id] > 0 ? (
                <div
                  className="inner-notif"
                  style={
                    unreadMessage[room_id] > 0
                      ? { transform: "scaleX(1) scaleY(1)" }
                      : null
                  }
                >
                  <span className="sum-notif">{unreadMessage[room_id]}</span>
                </div>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatDisplay.propTypes = {
  onClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  chat: PropTypes.string.isRequired,
};

export default ChatDisplay;

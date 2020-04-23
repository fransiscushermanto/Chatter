import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import CustomAvatar from "./CustomAvatar";
import * as actions from "../actions";
const ResultAddFriend = ({
  displayName,
  data,
  dataUser,
  socket,
  isFriend,
  setChatRoomData,
  setOpenUnblockModal,
  setOpenBlockModal,
  chatHistory,
}) => {
  const dispatch = useDispatch();
  const [friend, setFriend] = useState(false);
  const [room_id, setRoom_id] = useState("");
  //ADD FRIEND FUNCTION
  const onAddFriend = async () => {
    setFriend(true);
    const addFriendData = {
      friendId: data._id,
      userId: dataUser._id,
      user: dataUser,
    };
    await dispatch(actions.addFriend(addFriendData));
    socket.emit("GET_FRIEND");
  };

  //BLOCK FUNCTION
  const onBlock = () => {
    setChatRoomData({
      friendName: data.data.fullname,
      friend_id: data._id,
      room_id: room_id,
    });
    setOpenBlockModal(true);
  };

  //UNBLOCK FUNCTION
  const onUnBlock = () => {
    setChatRoomData({
      friendName: data.data.fullname,
      friend_id: data._id,
      room_id: room_id,
    });
    setOpenUnblockModal(true);
  };

  //FIRST LOAD SET ROOM ID TO ROOM_ID STATE AND CHECK FRIEND STATUS
  useEffect(() => {
    // console.log(data._id, data);
    setRoom_id(
      chatHistory.filter((history) => history.friend_id.includes(data._id))
        .length > 0
        ? chatHistory.filter((history) =>
            history.friend_id.includes(data._id)
          )[0].room_id
        : ""
    );
    if (isFriend(data._id).length === 1) {
      if (
        isFriend(data._id)[0].status === "block" ||
        isFriend(data._id)[0].status === "none"
      ) {
        setFriend(false);
      } else {
        setFriend(true);
      }
    }
  }, []);

  return (
    <div className="result-wrapper">
      <div className="inner-result-wrapper">
        <div className="user-avatar">
          <CustomAvatar size="40px" displayName={displayName} />
        </div>
        <div className="user-info-wrapper">
          <div className="user-displayName">
            <div className="inner-displayName">
              <span>{displayName}</span>
            </div>
          </div>
          <div className="action-button-wrapper">
            <button
              className={
                friend
                  ? "addFriend-icon-button friend"
                  : "addFriend-icon-button"
              }
              onClick={() => onAddFriend()}
              disabled={
                isFriend(data._id).length > 0
                  ? isFriend(data._id)[0].status === "block" || friend
                    ? true
                    : false
                  : friend
              }
              title="Add Friend"
            >
              {friend ? (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="user-check"
                  className="svg-inline--fa fa-user-check fa-w-20"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z"
                  ></path>
                </svg>
              ) : (
                <svg
                  style={{ width: "20px" }}
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="user-plus"
                  className="svg-inline--fa fa-user-plus fa-w-20"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                  ></path>
                </svg>
              )}
            </button>
            <button
              className="addFriend-icon-button"
              style={{ marginLeft: "3px" }}
              onClick={
                isFriend(data._id).length > 0
                  ? isFriend(data._id)[0].status === "block"
                    ? onUnBlock
                    : onBlock
                  : onBlock
              }
              title={
                isFriend(data._id).length > 0
                  ? isFriend(data._id)[0].status === "block"
                    ? "Unblock"
                    : "Block"
                  : "Block"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  style={
                    isFriend(data._id).length > 0
                      ? isFriend(data._id)[0].status !== "block"
                        ? { fill: "rgba(255,0,0,0.9)" }
                        : { fill: "rgba(15, 157, 88, 1)" }
                      : { fill: "rgba(255,0,0,0.9)" }
                  }
                  d="M12 2.8c-5.3 0-9.7 4.3-9.7 9.7s4.3 9.7 9.7 9.7 9.7-4.3 9.7-9.7-4.4-9.7-9.7-9.7zm-7.3 9.7c0-4 3.3-7.3 7.3-7.3 1.6 0 3.1.5 4.3 1.4L6.1 16.8c-.9-1.2-1.4-2.7-1.4-4.3zm7.3 7.3c-1.6 0-3-.5-4.2-1.4L17.9 8.3c.9 1.2 1.4 2.6 1.4 4.2 0 4-3.3 7.3-7.3 7.3z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ResultAddFriend.propTypes = {
  displayName: PropTypes.string.isRequired,
};

export default ResultAddFriend;

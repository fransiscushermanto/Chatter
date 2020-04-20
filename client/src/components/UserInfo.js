import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Avatar from "./CustomAvatar";

import * as actions from "../actions";
import "../css/UserInfo.css";
const UserInfo = ({
  userInfo,
  setChatRoomData,
  setOpenUnblockModal,
  setOpenBlockModal,
  setOpenDeleteRoomModal,
  socket,
  user,
}) => {
  const dispatch = useDispatch();

  const onBlock = () => {
    setChatRoomData({
      friendName: userInfo.data.fullName,
      friend_id: userInfo.data.friend_id,
      room_id: userInfo.data.room_id,
    });
    setOpenBlockModal(true);
  };

  const onUnBlock = () => {
    setChatRoomData({
      friendName: userInfo.data.fullName,
      friend_id: userInfo.data.friend_id,
      room_id: userInfo.data.room_id,
    });
    setOpenUnblockModal(true);
  };

  const onDelete = () => {
    setChatRoomData({
      friendName: userInfo.data.fullName,
      friend_id: userInfo.data.friend_id,
      room_id: userInfo.data.room_id,
    });
    setOpenDeleteRoomModal(true);
  };

  const onAddFriend = async () => {
    const addFriendData = {
      friendId: userInfo.data.friend_id,
      userId: userInfo.data.user_id,
      user: user,
    };
    await dispatch(actions.addFriend(addFriendData));
    socket.emit("UPDATE_ROOM");
    socket.emit("GET_FRIEND");
  };

  return (
    <div className="wrapper-footer-user-info">
      <div className="user-info-pane pane-1 ">
        <div className="avatar">
          <Avatar
            size="150px"
            round="150px"
            displayName={userInfo.data.fullName}
          ></Avatar>
        </div>
        <div className="displayInfo">
          <div className="displayName selectable-text">
            <span className="Text">{userInfo.data.fullName}</span>
          </div>
        </div>
      </div>
      <div className="user-info-pane pane-2 ">
        <div className="title">
          <span>Email</span>
        </div>
        <div className="user-email" title={userInfo.data.email}>
          <a href={`mailto:${userInfo.data.email}`}>
            <span>{userInfo.data.email}</span>
          </a>
        </div>
      </div>
      {userInfo.friend === null || userInfo.friend === "none" ? (
        <div className="user-info-pane button-pane special-pane">
          <div
            className="action-button"
            onClick={onAddFriend}
            role="button"
            title="Add Friend"
          >
            <div className="icon">
              <span data-icon="block">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="user-plus"
                  className="svg-inline--fa fa-user-plus fa-w-20"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  width="24"
                  height="24"
                  style={{ marginLeft: "3px" }}
                >
                  <path
                    fill="currentColor"
                    d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="text">
              <span>Add Friend</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="user-info-pane button-pane pane-3">
        <div
          className={
            userInfo.friend === "block"
              ? "block action-button"
              : "action-button"
          }
          onClick={userInfo.friend === "block" ? onUnBlock : onBlock}
          role="button"
          title={userInfo.friend === "block" ? "Unblock" : "Block"}
        >
          <div className="icon">
            <span data-icon="block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M12 2.8c-5.3 0-9.7 4.3-9.7 9.7s4.3 9.7 9.7 9.7 9.7-4.3 9.7-9.7-4.4-9.7-9.7-9.7zm-7.3 9.7c0-4 3.3-7.3 7.3-7.3 1.6 0 3.1.5 4.3 1.4L6.1 16.8c-.9-1.2-1.4-2.7-1.4-4.3zm7.3 7.3c-1.6 0-3-.5-4.2-1.4L17.9 8.3c.9 1.2 1.4 2.6 1.4 4.2 0 4-3.3 7.3-7.3 7.3z"
                ></path>
              </svg>
            </span>
          </div>
          <div className="text">
            <span>{userInfo.friend === "block" ? "Unblock" : "Block"}</span>
          </div>
        </div>
      </div>
      <div className="user-info-pane button-pane pane-4">
        <div
          onClick={onDelete}
          className="action-button"
          role="button"
          title="Delete Chat"
        >
          <div className="icon">
            <span data-icon="delete-chat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                ></path>
              </svg>
            </span>
          </div>
          <div className="text">
            <span>Delete Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

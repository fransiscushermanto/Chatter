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
  checkFriend
}) => {
  const dispatch = useDispatch();
  const [friend, setFriend] = useState(false);
  const onAddFriend = async () => {
    const addFriendData = {
      friendId: data._id,
      userId: dataUser._id,
      user: dataUser
    };
    await dispatch(actions.addFriend(addFriendData));
    setFriend(true);
    socket.emit("GET_FRIEND");
  };

  useEffect(() => {
    if (checkFriend(data._id).length === 1) {
      setFriend(true);
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
              className="addFriend-icon-button"
              onClick={() => onAddFriend()}
              disabled={friend}
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
          </div>
        </div>
      </div>
    </div>
  );
};

ResultAddFriend.propTypes = {
  displayName: PropTypes.string.isRequired
};

export default ResultAddFriend;

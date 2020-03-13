import React from "react";
import PropTypes from "prop-types";

import CustomAvatar from "./CustomAvatar";
const ResultAddFriend = ({ displayName }) => {
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
            <button className="addFriend-icon-button">
              <i class="fas fa-user-plus"></i>
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

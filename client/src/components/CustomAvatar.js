import React from "react";
import PropTypes from "prop-types";
import Avatar from "react-avatar";

const CustomAvatar = props => {
  const { size, displayName, round } = props;

  return (
    <Avatar
      round={round ? round : "50px"}
      size={size}
      name={displayName}
      className="profile-avatar"
      style={{ marginRight: "10px" }}
      maxInitials={2}
    />
  );
};

CustomAvatar.propTypes = {
  size: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  round: PropTypes.string
};

export default CustomAvatar;

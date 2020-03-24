import React from "react";
import PropTypes from "prop-types";
import { Link, useRouteMatch } from "react-router-dom";

import Avatar from "./CustomAvatar";

const FriendDisplay = ({ displayName, data, onClick }) => {
  let { url } = useRouteMatch();
  return (
    <Link
      to={`${url}?name=${displayName}`}
      className="cxroom"
      onClick={() => onClick(data)}
    >
      <Avatar size="40px" displayName={displayName} />
      <div className="displayer">
        <div className="display-name">
          <div className="inner-displayName">
            <span>{displayName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

FriendDisplay.propTypes = {
  displayName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default FriendDisplay;

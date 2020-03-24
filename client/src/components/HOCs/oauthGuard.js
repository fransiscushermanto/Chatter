import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default OriginalComponent => {
  const MixedComponent = () => {
    const history = useHistory();

    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    const authType = useSelector(state => state.auth.authType);

    useEffect(() => {
      const checkAuth = () => {
        if (!isAuth && !jwtToken && !authType && authType === "") {
          history.push("/home");
        }
        if (!isAuth && !jwtToken && !authType && authType !== "oauth") {
          history.push("/signin");
        }
      };

      if (isAuth && jwtToken && authType) {
        checkAuth();
      } else {
        history.push("/signin");
      }
    }, [authType, history, isAuth, jwtToken]);

    return <OriginalComponent props={useSelector(state => state.auth)} />;
  };

  return MixedComponent;
};

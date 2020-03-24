import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default OriginalComponent => {
  const MixedComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const jwtToken = useSelector(state => state.auth.token);
    const authType = useSelector(state => state.auth.authType);

    useEffect(() => {
      const checkAuth = async () => {
        console.log("Checking");
        if (isAuth && jwtToken) {
          if (
            localStorage.getItem("AUTH_TYPE") === "" ||
            localStorage.getItem("AUTH_TYPE") === "local"
          ) {
            history.push("/home");
          } else {
            history.push("/home");
          }

          return;
        } else if (localStorage.getItem("AUTH_TYPE") === "signup") {
          history.push("/signup");
          return;
        } else if (localStorage.getItem("AUTH_TYPE") === "signin") {
          history.push("/signin");
          return;
        } else if (!isAuth && !jwtToken) {
          history.push("/signin");
          return;
        }
      };

      checkAuth();
    }, [jwtToken, dispatch, history, isAuth]);

    useEffect(() => {
      const checkOAuth = data => {
        if (data === "oauth") {
          history.push("/personalData");
        }
      };
      checkOAuth(authType);
    }, [authType, history]);

    return <OriginalComponent props={useSelector(state => state.auth)} />;
  };

  return MixedComponent;
};

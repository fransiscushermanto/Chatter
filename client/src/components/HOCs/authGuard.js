import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import * as actions from "../../actions";
export default OriginalComponent => {
  const MixedComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const jwtToken = useSelector(state => state.auth.token);
    const authType = useSelector(state => state.auth.authType);

    const checkOAuth = data => {
      if (data === "oauth") {
        history.push("/personalData");
      }
    };

    const checkAuth = async () => {
      if (!isAuth && !jwtToken) {
        if (localStorage.getItem("AUTH_TYPE") === "signup") {
          history.push("/signup");
        } else {
          history.push("/signin");
        }
      }
    };

    const decodeData = async () => {
      await dispatch(actions.decodeJWT(jwtToken));
    };

    useEffect(() => {
      console.log(localStorage.getItem("AUTH_TYPE"));
      checkAuth();
      if (jwtToken !== null) {
        decodeData();
      }
    }, []);

    useEffect(() => {
      checkOAuth(authType);
    }, [authType]);

    return <OriginalComponent props={useSelector(state => state.auth)} />;
  };

  return MixedComponent;
};

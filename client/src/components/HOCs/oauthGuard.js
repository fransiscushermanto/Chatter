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
    const decodedJWT = useSelector(state => state.decode);

    useEffect(() => {
      const decodeData = async () => {
        await dispatch(actions.decodeJWT(jwtToken));
      };

      if (jwtToken !== null) {
        decodeData();
      }
    }, [dispatch, jwtToken]);

    useEffect(() => {
      const checkAuth = () => {
        if (decodedJWT.method === "google") {
          if (decodedJWT.user.google.status === "on") {
            history.push("/home");
          }
        } else {
          if (decodedJWT.user.facebook.status === "on") {
            window.location.href = "home";
          }
        }

        if (!isAuth && !jwtToken && !authType && authType !== "oauth") {
          history.push("/signin");
        }
      };

      if (decodedJWT.user !== "") {
        checkAuth();
      } else {
        history.push("/signin");
      }
    }, [decodedJWT, authType, history, isAuth, jwtToken]);

    return <OriginalComponent props={useSelector(state => state.auth)} />;
  };

  return MixedComponent;
};

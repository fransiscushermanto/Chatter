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

    const checkAuth = () => {
      if (decodedJWT.method === "google") {
        if (decodedJWT.user.google.status === "on") {
          history.push("/home");
        }
      } else {
        console.log(decodedJWT.user.facebook.status);
        if (decodedJWT.user.facebook.status === "on") {
          console.log(authType);
          window.location.href = "home";
        }
      }

      if (!isAuth && !jwtToken && !authType && authType !== "oauth") {
        console.log("Please sign in");
        history.push("/signin");
      }
    };

    const decodeData = async () => {
      await dispatch(actions.decodeJWT(jwtToken));
    };

    useEffect(() => {
      if (jwtToken !== null) {
        decodeData();
      }
    }, []);

    useEffect(() => {
      if (decodedJWT.user !== "") {
        checkAuth();
      } else {
        history.push("/signin");
      }
    }, [decodedJWT]);

    return <OriginalComponent props={useSelector(state => state.auth)} />;
  };

  return MixedComponent;
};

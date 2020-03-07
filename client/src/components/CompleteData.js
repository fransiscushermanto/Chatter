import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

import { Input } from "./ReactHookForm";
import * as actions from "../actions";

import "../css/CompleteData.css";
import "../css/Authuser.css";

let CompleteData = () => {
  const schema = yup.object().shape({
    fullname: yup
      .string()
      .required("This field is required")
      .min(3, "Name too short!")
      .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g, "Invalid")
  });

  const { register, errors, handleSubmit, watch } = useForm({
    validationSchema: schema
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector(state => state.auth.token);
  const jwtDataUser = useSelector(state => state.decode.user);
  const jwtMethod = useSelector(state => state.decode.method);
  const [statusUser, setStatus] = useState("");
  const [submitData, setSubmitData] = useState({});
  const [execute, setExecute] = useState(false);

  const onSubmit = data => {
    const user = { ...submitData };
    user.fullname = data.fullname;
    user.method = jwtMethod;
    user.status = "on";
    setSubmitData(user);
    setExecute(true);
  };
  const decode = async data => {
    await dispatch(actions.decodeJWT(data));
  };

  const updateData = async () => {
    await dispatch(actions.updateData(submitData));
    history.push("/home");
  };

  useEffect(() => {
    if (token) {
      decode(token);
    }
  }, []);

  useEffect(() => {
    if (jwtDataUser !== "") {
      if (jwtMethod === "google") {
        setSubmitData(jwtDataUser.google);
        setStatus(jwtDataUser.google.status);
      } else {
        setSubmitData(jwtDataUser.facebook);
        setStatus(jwtDataUser.facebook.status);
      }
    }
  }, [jwtMethod, jwtDataUser]);

  useEffect(() => {
    if (execute) {
      updateData();
    }
  }, [execute]);

  return (
    <div className="oauth-completedata">
      {jwtDataUser ? (
        statusUser === "off" ? (
          <div className="wrapper-form-oauth">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Let me call you?</h1>
              <Input
                name="fullname"
                defaultValues={submitData ? submitData.fullname : null}
                required={true}
                register={register}
                style={errors.fullname ? { border: "1px red solid" } : null}
              />
              {errors.fullname ? (
                <div>
                  <p style={{ color: "red", marginBottom: "0px" }}>
                    {errors.fullname.message}
                  </p>
                </div>
              ) : null}
              <div className="btnsubmit-wrapper">
                <button className="btn btn-primary" type="submit">
                  Done
                </button>
              </div>
            </form>
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default CompleteData;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

import { AuthInput as Field } from "./ReactHookForm";
import * as actions from "../actions";
const ForgetPassword = () => {
  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email is Invalid")
      .required("This field is required"),
  });

  const passSchema = yup.object().shape({
    password: yup
      .string()
      .required("This field is required")
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
        "Password length must be at least 6 include uppercase, lowercase, number "
      ),
  });
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [nextFormOpen, setNextFormOpen] = useState(false);

  const onCheckEmail = async (formData) => {
    setEmail(formData.email);
    await dispatch(actions.checkEmail(formData));

    if (errorMessage === "none" || errorMessage !== undefined) {
      setNextFormOpen(true);
    }
  };

  const onUpdateAccount = async (formData) => {
    const data = {
      email,
      password: formData.password,
    };
    await dispatch(actions.resetUserPassword(data));

    if (!errorMessage || errorMessage === "none") {
      setNextFormOpen(false);
      history.push("/signIn");
    }
  };

  const { register, errors, handleSubmit, watch } = useForm({
    validationSchema: nextFormOpen ? passSchema : emailSchema,
    nativeValidation: false,
  });
  useEffect(() => {
    if (nextFormOpen) {
      document.getElementById("password").value = "";
    }
  }, [nextFormOpen]);

  useEffect(() => {
    console.log(errorMessage);
    if (errorMessage === "none") {
      setNextFormOpen(true);
    }
  }, [errorMessage]);

  return (
    <div className="container">
      <div
        className="forget-password-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Forget Password
        </h1>

        <form
          onSubmit={
            nextFormOpen
              ? handleSubmit(onUpdateAccount)
              : handleSubmit(onCheckEmail)
          }
          style={{ width: "300px" }}
        >
          {nextFormOpen ? (
            <fieldset>
              <div style={{ display: "flex", position: "relative" }}>
                <Field
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Enter new Password"
                  autoComplete="current-password"
                  style={
                    errors.password || errorMessage
                      ? errorMessage !== "Invalid" && errorMessage !== "none"
                        ? { border: "1px red solid", flex: "1" }
                        : { flex: "1" }
                      : { flex: "1" }
                  }
                  required={true}
                  register={register}
                />
              </div>
              {errors.password ? (
                <div>
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {errors.password.message}
                  </p>
                </div>
              ) : null}
            </fieldset>
          ) : (
            <fieldset>
              <div style={{ display: "flex", position: "relative" }}>
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter Registered Email"
                  autoComplete="username"
                  style={
                    errors.email || errorMessage
                      ? errorMessage !== "Invalid" && errorMessage !== "none"
                        ? { border: "1px red solid", flex: "1" }
                        : { flex: "1" }
                      : { flex: "1" }
                  }
                  required={true}
                  register={register}
                />
                {errorMessage !== "none" &&
                errorMessage !== "" &&
                errorMessage !== undefined ? (
                  <div
                    className="icon"
                    style={{
                      position: "absolute",
                      left: "105%",
                      top: "18%",
                    }}
                    title="Email Not Registered"
                  >
                    <span data-icon="x">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          style={{ fill: "rgba(255,0,0,0.9)" }}
                          d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                ) : null}
              </div>
              {errors.email ? (
                <div>
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {errors.email.message}
                  </p>
                </div>
              ) : null}
            </fieldset>
          )}
          {nextFormOpen ? (
            <div className="btnsubmit-wrapper" style={{ marginTop: "0" }}>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          ) : (
            <div className="btnsubmit-wrapper" style={{ marginTop: "0" }}>
              <button className="btn btn-primary" type="submit">
                Next
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;

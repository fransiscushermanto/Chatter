import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import * as actions from "../actions";
import { AuthInput as Field } from "./ReactHookForm";

import "../css/Authuser.css";

let SignUp = props => {
  const schema = yup.object().shape({
    fullname: yup
      .string()
      .required("This field is required")
      .min(3, "Name too short!")
      .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g, "Invalid"),
    email: yup
      .string()
      .email("Email is Invalid")
      .required("This field is required"),
    password: yup
      .string()
      .required("This field is required")
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
        "Password length must be at least 6 include uppercase, lowercase, number "
      )
  });
  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema
  });
  const { history } = props;
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => state.auth.errorMessage);

  useEffect(() => {
    document.getElementsByClassName("top-wrapper")[0].style.cssText =
      "overflow: auto";
  }, []);

  useEffect(() => {
    const checkUserMethod = () => {
      console.log("current signup", localStorage.getItem("AUTH_TYPE"));
      const data = localStorage.getItem("AUTH_TYPE");
      if (!errorMessage && data === "") {
        console.log(data, "Pushing");
        history.push("/home");
      }

      if (data === "signin") {
        dispatch(actions.resetState());
      }

      if (!errorMessage && data === "oauth") {
        history.push("/personalData");
      }
    };

    checkUserMethod();
  }, [history, dispatch, errorMessage]);
  const onSubmit = async formData => {
    await dispatch(actions.signUp(formData));
    if (errorMessage) {
      history.push("/signup");
    }
    if (!errorMessage) {
      history.push("/home");
    }
  };
  const responseFacebook = async res => {
    await dispatch(actions.oauthFacebook(res.accessToken));
    if (!errorMessage) {
      history.push("/personalData");
    }
  };

  const responseGoogle = async res => {
    console.log(res.accessToken);
    await dispatch(actions.oauthGoogle(res.accessToken));
    if (!errorMessage) {
      history.push("/personalData");
    }
  };

  return (
    <div className="container">
      <div className="authuser register">
        <div className="row">
          <div className="col">
            <div className="title">
              <p>
                Please Register<br></br> To Access <br></br>
                <span className="dynamic-text">
                  Have an account ? <Link to="/signin">Sign In</Link>
                </span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="wrapper-auth">
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="title">Register</p>
                {errorMessage ? (
                  errorMessage !== "Invalid" ? (
                    <div style={{ width: "100%" }}>
                      <p className="bg-danger error-message">{errorMessage}</p>
                    </div>
                  ) : null
                ) : null}
                <fieldset>
                  <Field
                    name="fullname"
                    type="text"
                    id="fullname"
                    placeholder="Full Name"
                    required={true}
                    register={register}
                    style={
                      errors.fullname || errorMessage
                        ? errorMessage !== "Invalid" || errors.fullname
                          ? { border: "1px red solid" }
                          : null
                        : null
                    }
                  />
                  {errors.fullname ? (
                    <div>
                      <p style={{ color: "red" }}>{errors.fullname.message}</p>
                    </div>
                  ) : null}
                </fieldset>
                <fieldset>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Email"
                    required={true}
                    register={register}
                    autoComplete="username"
                    style={
                      errors.email || errorMessage
                        ? errorMessage !== "Invalid"
                          ? { border: "1px red solid" }
                          : null
                        : null
                    }
                  />
                  {errors.email ? (
                    <div>
                      <p style={{ color: "red" }}>{errors.email.message}</p>
                    </div>
                  ) : null}
                </fieldset>
                <fieldset>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    style={
                      errors.password || errorMessage
                        ? errorMessage !== "Invalid"
                          ? { border: "1px red solid" }
                          : null
                        : null
                    }
                    required={true}
                    register={register}
                  />
                  {errors.password ? (
                    <div>
                      <p style={{ color: "red", marginBottom: "0px" }}>
                        {errors.password.message}
                      </p>
                    </div>
                  ) : null}
                </fieldset>
                <div className="btnsubmit-wrapper">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>
              <div className="oauth-wrapper">
                <p>Or Register with</p>
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                  autoLoad={false}
                  disableMobileRedirect={true}
                  textButton="Facebook"
                  fields="name, email, picture"
                  callback={responseFacebook}
                  render={renderProps => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="btn facebook-btn oauth"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="facebook-f"
                        className="svg-inline--fa fa-facebook-f fa-w-10"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path
                          fill="currentColor"
                          d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                        ></path>
                      </svg>
                    </button>
                  )}
                />
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={renderProps => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="btn btn-danger google-btn oauth"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google-plus-g"
                        className="svg-inline--fa fa-google-plus-g fa-w-20"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599-65.484 0-118.92 54.221-118.92 121.277 0 67.056 53.436 121.277 118.92 121.277 75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z"
                        ></path>
                      </svg>
                    </button>
                  )}
                  buttonText="Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                >
                  <i
                    className="fa fa-google-plus"
                    style={{ marginLeft: "5px" }}
                  />
                </GoogleLogin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignUp);

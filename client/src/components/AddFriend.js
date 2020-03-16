import React, { useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useHistory, withRouter } from "react-router-dom";

import ResultAddFriend from "./ResultAddFriend";
import * as actions from "../actions";
import "../css/AddFriend.css";
const AddFriend = props => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const { history } = props;
  const findResult = useSelector(state => state.load.data);
  const jwtToken = useSelector(state => state.auth.token);
  const upJwtToken = useRef(jwtToken);
  const dataUser = useSelector(state => state.decode.user);

  useEffect(() => {
    console.log("currentToken", upJwtToken.current);
    console.log("jwtToken", jwtToken);
    if (jwtToken) {
      dispatch(actions.decodeJWT(jwtToken));
      if (upJwtToken.current !== jwtToken) {
        console.log("REF");

        history.push("/addFriend");
        console.log(history);
        upJwtToken.current = jwtToken;
      }
    }
  }, [dispatch, jwtToken]);
  const onSubmit = async data => {
    if (data !== "") {
      data["user"] = dataUser;
      data["user_id"] = dataUser._id;
    }

    await dispatch(actions.findFriend(data));
  };

  const renderResult = () => {
    let method;
    if (findResult.data) {
      if (findResult.data.length > 0) {
        return findResult.data.map(user => {
          if (user.method === "local") {
            method = user.local;
          } else if (user.method === "facebook") {
            method = user.facebook;
          } else {
            method = user.google;
          }
          return (
            <ResultAddFriend
              key={user._id}
              displayName={method.fullname}
              data={user}
              dataUser={dataUser}
            />
          );
        });
      } else {
        return <span>There is no result, Try to type other names</span>;
      }
    } else {
      return <span>There is no result, Let's find your new friend</span>;
    }
  };

  useEffect(() => {
    onSubmit("");
  }, []);

  return (
    <div className="addFriend-comp-wrapper">
      <div className="inner-addFriend-comp-wrapper">
        <div className="closebutton">
          <div className="close-container">
            <Link to={"/home"}>
              <div className="wrapperbutton">
                <div className="leftright"></div>
                <div className="rightleft"></div>
              </div>
              <label className="close">close</label>
            </Link>
          </div>
        </div>
        <div className="main-addFriend">
          <div className="searchBar">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <div className="searchPane">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  autoComplete="off"
                  className="searchFriend form-control"
                  placeholder="Search for new friend"
                  ref={register}
                />
              </div>
              <button className="search-button" type="submit">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="svg-inline--fa fa-search fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
          <div className="resultPane">
            <div className="title-result">
              <h1>Result :</h1>
            </div>
            <div className="result-field-wrapper">
              <div
                className="inner-result-field"
                style={
                  findResult
                    ? null
                    : { alignItems: "center", justifyContent: "center" }
                }
              >
                {renderResult()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AddFriend);

import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import ResultAddFriend from "./ResultAddFriend";
import "../css/AddFriend.css";
const AddFriend = () => {
  const { register, handleSubmit } = useForm();

  return (
    <div className="addFriend-comp-wrapper">
      <div className="inner-addFriend-comp-wrapper">
        <div className="closebutton">
          <Link to={"/home"}>
            <div class="close-container">
              <div className="wrapperbutton">
                <div class="leftright"></div>
                <div class="rightleft"></div>
              </div>
              <label class="close">close</label>
            </div>
          </Link>
        </div>
        <div className="main-addFriend">
          <div className="searchBar">
            <form autoComplete="off">
              <div className="searchPane">
                <input
                  type="text"
                  autoComplete="off"
                  className="searchFriend form-control"
                  placeholder="Search for new friend"
                />
              </div>
              <button className="search-button" type="submit">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  class="svg-inline--fa fa-search fa-w-16"
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
              <div className="inner-result-field">
                <ResultAddFriend displayName="Bot" />
                <ResultAddFriend displayName="Nathan Benedict" />
                <ResultAddFriend displayName="Vincent" />
                <ResultAddFriend displayName="Jeslin" />
                <ResultAddFriend displayName="Vanessa" />
                <ResultAddFriend displayName="Timot" />
                <ResultAddFriend displayName="Kevin" />
                <ResultAddFriend displayName="Kevin Allen" />
                <ResultAddFriend displayName="Alvin" />
                <ResultAddFriend displayName="Octa" />
                <ResultAddFriend displayName="Samuel Rio Andreas Nainggolan" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                <ResultAddFriend displayName="" />
                {/* <span>There is no result</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;

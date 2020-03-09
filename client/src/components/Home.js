import React from "react";

import Header from "./Home-Header";
import ChatDisplay from "./ChatDisplay";

import "../css/Home.css";
import "../css/responsive.css";
const Home = props => {
  return (
    <div className="main-wrapper">
      <div className="wrapper">
        <Header></Header>
        <div className="row">
          <div className="sider">
            <div className="search-bar">
              <div className="inner-search-bar">
                <div className="search-icon">
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
                </div>
                <div className="search-bar-wrapper">
                  <input
                    className="form-control"
                    type="search"
                    autoComplete="off"
                    placeholder="Search or start new chat"
                  />
                </div>
              </div>
            </div>
            <div className="pane-side">
              <div className="inner-pane-side">
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
                <ChatDisplay />
              </div>
            </div>
          </div>
          <div className="main-page">Main</div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Home-Header";
import ChatDisplay from "./ChatDisplay";
import ChatRoom from "./ChatRoom";
import * as actions from "../actions";

import "../css/Home.css";
import "../css/responsive.css";
const Home = props => {
  const dispatch = useDispatch();

  const dataUser = useSelector(state => state.decode.user);
  const jwtToken = useSelector(state => state.auth.token);

  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chatItem, setChatItem] = useState({
    sender: {
      displayName: "",
      chat: [""]
    },
    receiver: {
      displayName: "",
      chat: [""]
    }
  });
  const currentChatData = useRef();

  const chat = [
    { displayName: "Nathan Benedict Lotandy", chat: "Hello !" },
    {
      displayName: "Felix Herbert",
      chat:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos, sit!"
    },
    {
      displayName: "Briliant Yasa Tjunaidi",
      chat:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quas nihil in doloremque a placeat eaque autem quod cumque nam."
    }
  ];

  const onClickDisplayChat = e => {
    console.log(e);
    currentChatData.current = e;
    let user;
    if (dataUser.method === "facebook") {
      user = dataUser.facebook;
    } else if (dataUser.method === "google") {
      user = dataUser.google;
    } else {
      user = dataUser.local;
    }
    const data = {
      sender: {
        displayName: e.displayName,
        chat: [e.chat]
      },
      receiver: {
        displayName: user.fullname,
        chat: [""]
      }
    };
    setChatItem(data);
    setShowChatRoom(!showChatRoom);
  };
  const renderChatHistory = () => {
    return chat.map(data => {
      return (
        <ChatDisplay
          key={data.displayName}
          onClick={onClickDisplayChat}
          displayName={data.displayName}
          chat={data.chat}
          data={data}
        />
      );
    });
  };

  useEffect(() => {
    if (showChatRoom == false && currentChatData.current !== undefined) {
      setShowChatRoom(true);
    }
  }, [showChatRoom]);

  useEffect(() => {
    if (jwtToken) {
      dispatch(actions.decodeJWT(jwtToken));
    }
  }, [dispatch, jwtToken]);

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
              <div className="inner-pane-side">{renderChatHistory()}</div>
            </div>
          </div>
          <div className="main-page">
            {showChatRoom ? (
              <ChatRoom
                displayName={chatItem.sender.displayName}
                senderChat={chatItem.sender.chat}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

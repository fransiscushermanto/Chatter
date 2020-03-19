import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

import Header from "./Home-Header";
import ChatDisplay from "./ChatDisplay";
import ChatRoom from "./ChatRoom";
import AddFriend from "./AddFriend";
import * as actions from "../actions";

import "../css/Home.css";
import "../css/responsive.css";
const Home = props => {
  const chat = [
    {
      friendName: "Bot",
      chat: [
        { message: "Welcome to Chatter Bot!", read: true, status: "in" },
        { message: "Hello Bot, I'm Fransiscus", read: true, status: "out" },
        { message: "Hello Bot, I'm Fransiscus", read: true, status: "out" },
        { message: "Hello Fransiscus", read: true, status: "in" },
        { message: "Don't rush!", read: true, status: "in" },
        {
          message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam mollitia magni natus sint doloribus non dicta excepturi aspernatur illo magnam sit, accusamus, rem voluptatum dolore ipsa, accusantium beatae asperiores impedit sequi blanditiis unde! Assumenda fugit eligendi mollitia ea minima cumque iure non sint, suscipit eaque quam aliquam, corporis sed! Officia incidunt aut non nesciunt beatae. Laboriosam sunt sint aspernatur, quaerat ad eum minima accusamus, est repudiandae tempora adipisci atque, earum pariatur? Veritatis sunt iusto, pariatur perspiciatis autem consectetur debitis eum adipisci at impedit facilis? Cum quam mollitia suscipit ipsum voluptatum officia, assumenda harum at quis doloremque voluptas exercitationem veniam veritatis!",
          read: true,
          status: "out"
        },
        { message: "Stop spamming!", read: true, status: "in" }
      ]
    },
    {
      friendName: "Nathan Benedict Lotandy",
      chat: [
        {
          message: "Fransiscus Pinjam Handphone la lalalalala",
          read: true,
          status: "in"
        }
      ]
    },
    {
      friendName: "Samuel Rio Andres Nainggolan",
      chat: [
        { message: "Welcome to Chatter Bot!", read: true, status: "in" },
        { message: "Hello Bot, I'm Fransiscus", read: true, status: "out" },
        { message: "Hello Bot, I'm Fransiscus", read: true, status: "out" },
        { message: "Hello Fransiscus", read: true, status: "in" },
        { message: "Don't rush!", read: true, status: "in" },
        {
          message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam mollitia magni natus sint doloribus non dicta excepturi aspernatur illo magnam sit, accusamus, rem voluptatum dolore ipsa, accusantium beatae asperiores impedit sequi blanditiis unde! Assumenda fugit eligendi mollitia ea minima cumque iure non sint, suscipit eaque quam aliquam, corporis sed! Officia incidunt aut non nesciunt beatae. Laboriosam sunt sint aspernatur, quaerat ad eum minima accusamus, est repudiandae tempora adipisci atque, earum pariatur? Veritatis sunt iusto, pariatur perspiciatis autem consectetur debitis eum adipisci at impedit facilis? Cum quam mollitia suscipit ipsum voluptatum officia, assumenda harum at quis doloremque voluptas exercitationem veniam veritatis!",
          read: true,
          status: "out"
        },
        { message: "Stop spamming!", read: true, status: "in" }
      ]
    }
  ];

  const socketUrl = `${process.env.REACT_APP_SOCKET_URL ||
    window.location.origin}`;

  let { path } = useRouteMatch();
  const dispatch = useDispatch();

  const socketRef = useRef();
  const jwtToken = useSelector(state => state.auth.token);
  const dataUser = useSelector(state => state.decode.user);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatItem, setChatItem] = useState({
    friendName: "",
    chat: []
  });

  const currentChatData = useRef();

  const renderChatHistory = () => {
    if (searchResult.length > 0) {
      return searchResult.map(data => {
        return (
          <ChatDisplay
            key={data.friendName}
            onClick={onClickDisplayChat}
            displayName={data.friendName}
            chat={data.chat}
            data={data}
          />
        );
      });
    } else if (searchValue !== "" && searchResult.length === 0) {
      return (
        <div
          className="search-errorWrapper"
          style={{ height: "100%", display: "flex" }}
        >
          <span
            style={{
              textAlign: "center",
              width: "100%",
              marginTop: "50px",
              minWidth: "321px",
              maxWidth: "321px"
            }}
          >
            Theres is no result for "{searchValue}"
          </span>
        </div>
      );
    } else {
      return chatHistory.map(data => {
        return (
          <ChatDisplay
            key={data.friendName}
            onClick={onClickDisplayChat}
            displayName={data.friendName}
            chat={data.chat}
            data={data}
          />
        );
      });
    }
  };

  const renderFriendList = () => {};

  const onClickDisplayChat = e => {
    console.log(e);
    currentChatData.current = e;
    const name = e.friendName;
    const chat = e.chat;

    const data = {
      friendName: name,
      chat
    };
    socketRef.current.emit("join", { name });
    setChatItem(data);
    setShowChatRoom(!showChatRoom);
  };

  const onSendChat = e => {
    socketRef.current.emit("SEND_MESSAGE", {
      message: e.message,
      status: "out"
    });
  };

  const handleChange = e => {
    setSearchValue(e.target.value);
  };

  const switchPane = e => {
    var id = e.target.id;
    var charId = id.split("-");
    if (charId[0] === "chat") {
      setShowChatHistory(true);
    } else if (charId[0] === "friend") {
      setShowChatHistory(false);
    }
  };

  useEffect(() => {
    const results = chatHistory.filter(chat =>
      chat.friendName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResult(results);
  }, [searchValue]);

  useEffect(() => {
    socketRef.current = io.connect(socketUrl);
    return () => {
      socketRef.current = io.connect(socketUrl);
    };
  }, [socketUrl]);

  const socket = socketRef.current;

  useEffect(() => {
    socketRef.current.on("RECEIVE_MESSAGE", data => {
      setChatItem({
        ...chatItem,
        chat: [...chatItem.chat, data]
      });
    });
  }, [chatItem]);

  useEffect(() => {
    const fetchMessage = () => {
      setChatHistory([...chatHistory, ...chat]);
    };
    fetchMessage();
    document.getElementsByClassName("app-wrapper")[0].style.cssText =
      "margin: 0px";
  }, []);

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
                    placeholder={
                      showChatHistory ? "Search chat" : "Search friend"
                    }
                    value={searchValue}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="pane-side">
              <div className="inner-pane-side">
                {showChatHistory ? renderChatHistory() : null}
              </div>
            </div>
            <div className="taskbar-side">
              <div className="inner-taskbar">
                <button
                  id="chat-btn"
                  className="taskbar-btn chat"
                  onClick={switchPane}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="comment"
                    className="svg-inline--fa fa-comment fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"
                    ></path>
                  </svg>
                </button>
                <button
                  id="friend-btn"
                  className="taskbar-btn friend"
                  onClick={switchPane}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="user-friends"
                    className="svg-inline--fa fa-user-friends fa-w-20"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <path
                      fill="currentColor"
                      d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="main-page">
            {showChatRoom ? (
              <ChatRoom
                displayName={chatItem.friendName}
                chat={chatItem.chat}
                onSubmit={onSendChat}
              />
            ) : null}
          </div>
        </div>
        <Switch>
          <Route path={`${path}/addFriend`}>
            {socket && <AddFriend dataUser={dataUser} socket={socket} />}
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
// let user;
// if (dataUser.method === "facebook") {
//   user = dataUser.facebook;
// } else if (dataUser.method === "google") {
//   user = dataUser.google;
// } else {
//   user = dataUser.local;
// }

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
  const socketUrl = `${process.env.REACT_APP_SOCKET_URL ||
    window.location.origin}`;

  let { path } = useRouteMatch();
  const socketRef = useRef();
  const dispatch = useDispatch();

  const dataUser = useSelector(state => state.decode.user);
  const jwtToken = useSelector(state => state.auth.token);

  const [showChatRoom, setShowChatRoom] = useState(false);

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
  const [chatHistory, setChatHistory] = useState([]);

  const [chatItem, setChatItem] = useState({
    friendName: "",
    chat: []
  });

  const currentChatData = useRef();

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

  useEffect(() => {
    socketRef.current = io.connect(socketUrl);
    return () => {
      socketRef.current = io.connect(socketUrl);
    };
  }, [socketUrl]);

  const onSendChat = e => {
    socketRef.current.emit("SEND_MESSAGE", {
      message: e.message,
      status: "out"
    });
  };

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
    console.log(path);
  }, []);

  const renderChatHistory = () => {
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
                displayName={chatItem.friendName}
                chat={chatItem.chat}
                onSubmit={onSendChat}
              />
            ) : null}
          </div>
        </div>
        <Switch>
          <Route path={`${path}/:subPage`}>
            <AddFriend dataUser={dataUser} />
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

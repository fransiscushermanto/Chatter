import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, Switch, Route, useHistory } from "react-router-dom";
import io from "socket.io-client";

import Header from "./Home-Header";
import ChatDisplay from "./ChatDisplay";
import ChatRoom from "./ChatRoom";
import AddFriend from "./AddFriend";
import FriendDisplay from "./FriendDisplay";
import UserProfile from "./UserProfile";
import * as actions from "../actions";

import "../css/Home.css";
import "../css/responsive.css";

const socketUrl = `${
  process.env.REACT_APP_SOCKET_URL || window.location.origin
}`;
const Home = () => {
  let { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  const chatList = useSelector((state) => state.personal.data);
  const allChatHistory = useSelector((state) => state.personal.chat);
  const listFriend = useSelector((state) => state.friend.data);
  const dataUser = useSelector((state) => state.decode.user);
  const allUser = useSelector((state) => state.user.data);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [unreadMessage, setUnreadMessage] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showProfile, setShowProfile] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [friendList, setFriendList] = useState();
  const [userList, setUserList] = useState();
  const [allChatState, setAllChatState] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState("");
  const [roomStatus, setRoomStatus] = useState([]);
  const [chatItem, setChatItem] = useState({
    friendName: "",
    userName: "",
    room_id: "",
    friend_id: "",
    user_id: "",
  });

  //CONNECT SOCKET.IO-ClIENT

  useEffect(() => {
    //Init Socket
    const initSocket = () => {
      const sockets = io.connect(socketUrl);
      sockets.on("connect", function () {
        sockets.emit("NEW USER");
      });
      setSocket(sockets);
    };
    initSocket();
  }, [socketUrl]);

  /*---ALL FUNCTION---*/

  //LOAD FRIEND FUNCTION
  const loadFriend = async () => {
    const loadFriendData = {
      user_id: dataUser._id,
      user: dataUser,
    };
    await dispatch(actions.getCurrentFriend(loadFriendData));
  };

  //LOAD ROOM HISTORY
  const loadRoom = async () => {
    const room = {
      user_id: dataUser._id,
      user: dataUser,
    };
    await dispatch(actions.loadRoom(room));
  };

  //LOAD ALL CHAT
  const loadAllChat = async () => {
    const data = {
      room_id: "all",
      user: dataUser,
    };
    await dispatch(actions.loadAllChat(data));
  };

  //LOAD CHAT HISTORY FUNCTION
  const loadChatHistory = () => {
    if (chatList.length > 0) {
      const chats = [],
        arr = [],
        room = [];
      chatList.map((data) => {
        arr[data.room_id] = 0;
        room[data.room_id] = data.status;
        const friend = friendList.filter((friend) =>
          friend._id.includes(data.friend_id)
        );
        const user = userList.filter((user) =>
          user.user_id.includes(data.friend_id)
        );
        socket.emit("JOIN_CHAT_ROOM", data.room_id);
        if (friend.length === 1) {
          chats.push({
            room_id: data.room_id,
            friendName: friend[0].profile.fullname,
            chat: data.lastchat.chat,
            time: data.lastchat.time,
            status: data.status,
            friend_id: data.friend_id,
            read: data.lastchat.status,
            userName: profileName,
          });
        } else if (user.length === 1) {
          chats.push({
            room_id: data.room_id,
            friendName: user[0].user.fullname,
            chat: data.lastchat.chat,
            time: data.lastchat.time,
            status: data.status,
            friend_id: data.friend_id,
            read: data.lastchat.status,
            userName: profileName,
          });
        }
      });
      setRoomStatus(room);
      handleUnreadMessage(arr);
      setChatHistory(chats);
    }
  };

  //LOAD CHAT ITEM TO CHAT ROOM
  const onClickDisplayChat = (e) => {
    const data = {
      user_id: dataUser._id,
      friendName: e.friendName,
      room_id: e.room_id,
      status: e.status,
      friend_id: e.friend_id,
      userName: e.userName,
    };
    setChatItem(data);
    setShowChatRoom(!showChatRoom);
  };

  //GET ALL USER DATA FROM DATABASE
  const getAllUser = async () => {
    const data = {
      fullname: "all",
      user: dataUser,
      user_id: dataUser._id,
    };

    await dispatch(actions.findFriend(data));
  };

  //RENDER ALL CHAT HISTORY
  const renderChatHistory = () => {
    if (searchResult.length > 0) {
      return searchResult.map((data) => {
        return (
          <ChatDisplay
            key={data.room_id}
            room_id={data.room_id}
            unreadMessage={unreadMessage}
            onClick={onClickDisplayChat}
            displayName={data.friendName}
            chat={data.chat}
            time={data.time}
            read={data.read}
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
              maxWidth: "321px",
            }}
          >
            Theres is no result for "{searchValue}"
          </span>
        </div>
      );
    } else {
      return chatHistory.map((data) => {
        return (
          <ChatDisplay
            key={data.room_id}
            room_id={data.room_id}
            unreadMessage={unreadMessage}
            onClick={onClickDisplayChat}
            displayName={data.friendName}
            chat={data.chat}
            time={data.time}
            read={data.read}
            data={data}
          />
        );
      });
    }
  };

  //RENDER ALL FRIEND LIST
  const renderFriendList = () => {
    if (searchResult.length > 0) {
      return searchResult.map((friend, index) => {
        return (
          <FriendDisplay
            key={index}
            displayName={friend.fullname}
            data={{ fullname: friend.fullname, email: friend.email }}
            onClick={renderProfile}
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
              maxWidth: "321px",
            }}
          >
            Theres is no result for "{searchValue}"
          </span>
        </div>
      );
    } else {
      if (friendList.length > 0) {
        return friendList.map((friend, index) => {
          return (
            <FriendDisplay
              key={index}
              displayName={friend.profile.fullname}
              data={{
                _id: friend._id,
                fullname: friend.profile.fullname,
                email: friend.profile.email,
              }}
              onClick={renderProfile}
            />
          );
        });
      } else {
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
                maxWidth: "321px",
              }}
            >
              There is no friend! Go find some friend!
            </span>
          </div>
        );
      }
    }
  };

  //RENDER PROFILE FUNCTION
  const renderProfile = (e) => {
    if (e) {
      setShowProfile(e);
    } else {
      setShowProfile(undefined);
    }
  };

  //CREATE CHAT ROOM FUNCTION
  const createChatRoom = async (data) => {
    const create = {
      user_id: dataUser._id,
      friend_id: data._id,
      user: dataUser,
    };
    await dispatch(actions.createRoom(create));
    loadRoom();
    setShowProfile(undefined);
    setShowChatHistory(true);
    history.push("/home");
  };

  //HANDLE SEARCH VALUE FUNCTION
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  //HANDLE UNREAD MESSAGE
  const handleUnreadMessage = (listRoom) => {
    if (allChatState.length > 0) {
      allChatState.map((data) => {
        if (data.status === "unread" && data.sender_id !== dataUser._id) {
          listRoom[data.room_id] = listRoom[data.room_id] + 1;
        }
      });
      setUnreadMessage(listRoom);
    }
  };

  //SWITCH CHATDISPLAY OR FRIENDLIST PANE
  const switchPane = (e) => {
    var id = e.target.id;
    var charId = id.split("-");
    if (charId[0] === "chat") {
      setSearchValue("");
      setSearchResult([]);
      setShowChatHistory(true);
    } else if (charId[0] === "friend") {
      setSearchValue("");
      setSearchResult([]);
      setShowChatHistory(false);
    }
  };

  //FETCH FRIEND DATA FUNCTION
  const fetchFriend = () => {
    var array = [];
    if (listFriend !== "") {
      if (listFriend.friends.length > 0) {
        listFriend.friends.map((list) => {
          list.my_friend.map((friend) => {
            let userData;
            if (friend.method === "google") {
              userData = friend.google;
            } else if (friend.method === "facebook") {
              userData = friend.facebook;
            } else {
              userData = friend.local;
            }
            const data = {
              _id: friend._id,
              profile: userData,
            };
            array.push(data);
          });
        });
        setFriendList([...array]);
      }
    } else {
      setFriendList([]);
    }
  };

  //FETCH ALL USER DATA FUNCTION
  const fetchUser = () => {
    var array = [];
    var user;
    if (allUser !== "") {
      if (allUser.data.length > 0) {
        allUser.data.map((list) => {
          if (list.method === "local") {
            user = list.local;
          } else if (list.method === "google") {
            user = list.google;
          } else if (list.method === "facebook") {
            user = list.facebook;
          }
          const data = {
            user_id: list._id,
            user,
          };

          array.push(data);
        });
        setUserList(array);
      }
    } else {
      setUserList([]);
    }
  };

  //CHECK isFRIEND FUNCTION
  const isFriend = (id) => {
    return listFriend.friends.filter((data) => data.friend_id === id);
  };

  //SEARCH FUNCTION
  const search = () => {
    const results = showChatHistory
      ? chatHistory.filter((chat) =>
          chat.friendName.toLowerCase().includes(searchValue.toLowerCase())
        )
      : friendList.filter((friend) =>
          friend.fullname.toLowerCase().includes(searchValue.toLowerCase())
        );
    setSearchResult(results);
  };

  /*---ON LOAD TASK---*/

  //FIRST RENDER LOAD ALL
  useEffect(() => {
    document.getElementsByClassName("app-wrapper")[0].style.cssText =
      "margin: 0px";
    var ua = navigator.userAgent;
    console.log(ua);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    ) {
      console.log("MOBILE");
    }
  }, []);

  //START SEARCH
  useEffect(() => {
    search();
  }, [searchValue]);

  //LOAD FRIEND & LOAD USER DATA
  useEffect(() => {
    if (dataUser !== "") {
      loadAllChat();
      loadFriend();
      loadRoom();
      getAllUser();
      const data = dataUser;
      var fullname;
      if (data.method === "local") {
        fullname = data.local.fullname;
      } else if (data.method === "facebook") {
        fullname = data.facebook.fullname;
      } else {
        fullname = data.google.fullname;
      }
      setProfileName(fullname);
    }
  }, [dataUser]);

  //SOCKET LOAD USER
  useEffect(() => {
    if (dataUser !== "" && socket !== "") {
      socket.on("LOAD_USER", () => getAllUser());

      return () => {
        socket.off("LOAD_USER", () => getAllUser());
      };
    }
  }, [socket, dataUser]);

  //SOCKET LOAD FRIEND
  useEffect(() => {
    if (dataUser !== "" && socket !== "") {
      socket.on("LOAD_FRIEND", () => loadFriend());

      return () => {
        socket.off("LOAD_FRIEND", () => loadFriend());
      };
    }
  }, [socket, dataUser]);

  //SOCKET NEW ROOM
  useEffect(() => {
    if (dataUser !== "" && socket !== "") {
      socket.on("UPCOMING_ROOM", () => {
        loadAllChat();
        loadRoom();
        loadChatHistory();
      });
      return () => {
        socket.off("UPCOMING_ROOM", () => {
          loadAllChat();
          loadRoom();
          loadChatHistory();
        });
      };
    }
  }, [socket, dataUser]);

  //SOCKET RECEIVE MESSAGE
  useEffect(() => {
    if (socket !== "" && dataUser !== "") {
      socket.on("RECEIVE_MESSAGE", () => {
        loadAllChat();
        loadRoom();
        loadChatHistory();
      });
      return () => {
        socket.off("RECEIVE_MESSAGE", () => {
          loadAllChat();
          loadRoom();
          loadChatHistory();
        });
      };
    }
  }, [socket, dataUser]);

  //SOCKET RELOAD MESSAGE
  useEffect(() => {
    if (socket !== "" && dataUser !== "") {
      socket.on("RELOAD_MESSAGE", () => {
        console.log("RELOADING MESSAGE");
        loadAllChat();
        loadRoom();
        loadChatHistory();
      });
      return () => {
        socket.on("RELOAD_MESSAGE", () => {
          console.log("RELOADING MESSAGE");
          loadAllChat();
          loadRoom();
          loadChatHistory();
        });
      };
    }
  }, [socket, dataUser]);

  //SHOWCHAT ROOM STATE HANDLER
  useEffect(() => {
    if (showChatRoom == false && chatItem.friendName !== "") {
      setShowChatRoom(true);
    }
  }, [showChatRoom]);

  //FETCH FRIEND
  useEffect(() => {
    fetchFriend();
  }, [listFriend]);

  //LOAD ALL CHAT TO CHATDISPLAY
  useEffect(() => {
    loadChatHistory();
  }, [chatList, friendList, userList]);

  //SET CHAT FROM DATABASE TO STATE
  useEffect(() => {
    if (allChatHistory.length > 0) {
      setAllChatState(allChatHistory);
    }
  }, [allChatHistory]);

  //FETCH USER
  useEffect(() => {
    fetchUser();
  }, [allUser]);

  // useEffect(() => {
  //   console.log(roomStatus);
  // }, [roomStatus]);

  return (
    <div className="main-wrapper">
      <div className="wrapper">
        <Header
          profileName={profileName}
          renderProfile={renderProfile}
          socket={socket}
        ></Header>
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
                {showChatHistory && unreadMessage
                  ? renderChatHistory()
                  : renderFriendList()}
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
                key={chatItem.room_id}
                displayName={chatItem.friendName}
                user_id={chatItem.user_id}
                room_id={chatItem.room_id}
                status={roomStatus[chatItem.room_id]}
                friend_id={chatItem.friend_id}
                user={dataUser}
                unreadMessage={unreadMessage[chatItem.room_id]}
                socket={socket}
                userName={chatItem.userName}
                chats={allChatState}
              />
            ) : null}
          </div>
        </div>
        <Switch>
          <Route path={`${path}/addFriend`}>
            <AddFriend
              isFriend={isFriend}
              dataUser={dataUser}
              loadFriend={loadFriend}
              socket={socket}
              renderProfile={renderProfile}
            />
          </Route>
        </Switch>
        {showProfile !== undefined ? (
          <UserProfile
            profile={showProfile}
            onClick={renderProfile}
            isFriend={isFriend}
            socket={socket}
            createChatRoom={createChatRoom}
          />
        ) : null}
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

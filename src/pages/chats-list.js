import React, { useEffect, useState } from "react";
import FooterMenu from "../components/footer-menu";
import { useHistory, Link } from "react-router-dom";
import moment from "jalali-moment";
import FlatOptions from "../components/flat-options";
import Backdrop from "../components/backdrop";
import Transition from "react-transition-group/Transition";
import openSocket from "socket.io-client";
import { useSelector } from "react-redux";

function ChatsListPage() {
  const userRedux = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [socket, setSocket] = useState(null);

  const [chatsInfo, setChatsInfo] = useState([]);
  const [noChat, setNoChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatForOptions, setChatForOptions] = useState();
  const [showFlatOptions, setShowFlatOptions] = useState(false);

  async function FetchChats() {
    setIsLoading(true);
    if (!token) {
      return;
    }

    setError(null);
    try {
      const response = await fetch("http://localhost:8080/chats", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching data!");
      }

      const data = await response.json();
      if (data.state === "Ok") {
        setNoChat(false);
        setChatsInfo(data.chats);
      }
      if (data.state === "NoChat") {
        setNoChat(true);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (socket === null) {
      setSocket(
        openSocket("http://localhost:8080", {
          transports: ["websocket"],
        })
      );
    }
    if (socket) {
      socket.on("chat", (data) => {
        if (
          data.userIds.includes(userRedux.userInfo.id) &&
          data.deletingUser === userRedux.userInfo.id
        ) {
          if (data.action === "allDeleted") {
            const newChatsArray = chatsInfo.filter((c) => {
              if (data.chatId === c._id) {
                return false;
              } else {
                return true;
              }
            });
            setChatsInfo(newChatsArray);
          }
        }
      });
    }
  }, [socket, chatsInfo, setChatsInfo]);

  function toggleFlatOptions() {
    setShowFlatOptions((prevState) => !prevState);
  }

  function closePopup() {
    setShowFlatOptions(false);
  }

  useEffect(() => {
    if (token) {
      FetchChats();
    } else {
      setNoChat(true);
    }
  }, []);

  function DragChat(event, chat) {
    let target = event.target;
    let offsetX = event.clientX;
    if (offsetX > 250) {
      setShowFlatOptions(true);
    }
    setChatForOptions(chat);
    target.style.transform = `translateX(${-offsetX}px)`;
  }

  async function DeleteChatHandler(event) {
    event.preventDefault();
    closePopup();
    try {
      const response = await fetch("http://localhost:8080/deleteChat", {
        method: "PUT",
        body: JSON.stringify({
          chatId: chatForOptions._id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "allDeleted") {
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <Transition in={showFlatOptions} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <>
            <FlatOptions
              popupClose={closePopup}
              buttons={[
                { action: DeleteChatHandler, title: "Delete Chat" },
                { action: closePopup, title: "Close", cssClass: "black" },
              ]}
              show={state}
            />
            <Backdrop clicked={closePopup} show={state} />
          </>
        )}
      </Transition>
      <div className="top-menu-name">
        <Link to="/" className="back-menu"></Link>
        <h2>Chats</h2>
      </div>

      {!isLoading && !error && chatsInfo && (
        <div className="chats-page-cnt">
          {chatsInfo.map((chatItem, key) => {
            return (
              <Link
                to={{ pathname: "/chat/", state: { chatId: chatItem._id } }}
                className="chat-item"
                key={key}
                draggable
                onDrag={(event) => DragChat(event, chatItem)}
              >
                <div className="chat-ftu-img">
                  <div
                    className="img"
                    style={{
                      backgroundImage: `url(http://localhost:8080/uploads/user/${chatItem.pic})`,
                    }}
                  ></div>
                  {chatItem.isOnline ? (
                    <div className="person-offline"></div>
                  ) : (
                    <div className="person-offline"></div>
                  )}
                </div>

                <div className="chat-item-left">
                  <div className="chat-name-flx">
                    <h4>{chatItem.name}</h4>

                    {chatItem.notSeenCount && chatItem.notSeenCount > 100 ? (
                      <div>+99</div>
                    ) : chatItem.notSeenCount !== 0 ? (
                      <div>{chatItem.notSeenCount}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={`chat-message-flx ${
                      chatItem.lastMessageSeen && "has-read"
                    }`}
                  >
                    <p>
                      {chatItem.lastMessageSeen &&
                        chatItem.lastMessageWhose === "mine" && <span></span>}

                      {chatItem.lastMessageDeleted === true
                        ? "Deleted"
                        : chatItem.lastMessageIsImage
                        ? "Image"
                        : chatItem.lastMessage.substring(0, 25) + " ..."}
                    </p>
                    <div>
                      {moment(chatItem.lastMessageTime)
                        .locale("en")
                        .format("HH:mm")}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <FooterMenu activeItem={"chats"} />
    </>
  );
}

export default ChatsListPage;

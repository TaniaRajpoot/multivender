import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server, socket_server } from "../server";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineSend, AiOutlinePaperClip } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { ui } from "../styles/theme";

const ENDPOINT = socket_server;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInboxPage = () => {
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (conversations.length > 0) {
      const queryId = location.search.replace("?/", "");
      if (queryId) {
        const chat = conversations.find((c) => c._id === queryId);
        if (chat) {
          setCurrentChat(chat);
          setOpen(true);
        }
      }
    }
  }, [conversations, location.search]);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        images: data.images || null,
      });
    });

    socketId.on("getLastMessage", ({ lastMessage, lastMessageId }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.members.includes(lastMessageId)
            ? { ...conv, lastMessage, lastMessageId }
            : conv
        )
      );
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user?._id}`, {
          withCredentials: true,
        });
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) getConversation();
  }, [user]);

  useEffect(() => {
    if (user) {
      socketId.emit("addUser", user._id);
      socketId.on("getUsers", (data) => setOnlineUsers(data));
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((member) => member !== user?._id);
    return onlineUsers.some((u) => u.userId === chatMember);
  };

  useEffect(() => {
    if (currentChat) {
      setActiveStatus(onlineCheck(currentChat));
      const fetchUserData = async () => {
        const shopId = currentChat.members.find((m) => m !== user?._id);
        try {
          const res = await axios.get(`${server}/shop/get-shop-info/${shopId}`);
          setUserData(res.data.shop);
        } catch (error) { console.log(error); }
      };
      fetchUserData();
    }
  }, [onlineUsers, currentChat, user]);

  useEffect(() => {
    const getMessage = async () => {
      if (!currentChat) return;
      try {
        const response = await axios.get(`${server}/messages/get-all-messages/${currentChat._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !images) return;

    const receiverId = currentChat.members.find((m) => m !== user._id);
    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      images: images || null,
    });

    try {
      const res = await axios.post(`${server}/messages/create-new-message`, {
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
        images: images || null,
      });
      setMessages([...messages, res.data.message]);
      setNewMessage("");
      setImages(null);

      const lastMsg = images ? "Photo" : newMessage;
      await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: lastMsg,
        lastMessageId: user._id,
      });
      socketId.emit("updateLastMessage", { lastMessage: lastMsg, lastMessageId: user._id });
      setConversations((prev) =>
        prev.map((conv) => (conv._id === currentChat._id ? { ...conv, lastMessage: lastMsg, lastMessageId: user._id } : conv))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImages(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={ui.page}>
      <Header />
      <div className={`${ui.container} py-6`}>
        <div className="mb-4">
          <h1 className={ui.title}>Inbox</h1>
          <p className={ui.subtitle}>Chat with sellers and track your conversations</p>
        </div>
        
        <div className="h-[75vh] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex relative">
          {/* Sidebar: Conversation List */}
          <div className={`
             w-full md:w-[350px] flex flex-col border-r border-gray-200 bg-gray-50/50 transition-all duration-300
             ${open ? "hidden md:flex" : "flex"}
          `}>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.map((item, index) => (
                <ConversationCard
                  key={index}
                  data={item}
                  me={user?._id}
                  online={onlineCheck(item)}
                  active={currentChat?._id === item._id}
                  onClick={() => {
                    setCurrentChat(item);
                    setOpen(true);
                  }}
                  setUserData={setUserData}
                  setActiveStatus={setActiveStatus}
                />
              ))}
              {conversations.length === 0 && (
                <div className={ui.empty}>
                  No active chats
                </div>
              )}
            </div>
          </div>

          {/* Main: Message Area */}
          <div className={`
             flex-1 flex flex-col bg-white transition-all duration-300
             ${open ? "flex" : "hidden md:flex"}
          `}>
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition">
                      <BsArrowLeft size={18} />
                    </button>
                    <div className="relative">
                      <img src={userData?.avatar?.url || "/placeholder.png"} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      {activeStatus && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 leading-tight">{userData?.name}</h3>
                      <p className="text-xs text-gray-500">{activeStatus ? "Active now" : "Offline"}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
                  {messages.map((item, index) => (
                    <MessageBubble
                      key={index}
                      item={item}
                      me={user?._id}
                      userData={userData}
                    />
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200 relative">
                  {images && (
                    <div className="absolute bottom-full left-4 mb-3 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 w-24 aspect-square">
                        <img src={images} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setImages(null)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition">×</button>
                      </div>
                    </div>
                  )}
                  <form onSubmit={sendMessageHandler} className="bg-white border border-gray-300 rounded-lg p-1.5 flex items-center shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition">
                    <label className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-teal-700 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                      <AiOutlinePaperClip size={20} />
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                    />
                    <button type="submit" className={`p-2.5 rounded-lg transition ${newMessage.trim() || images ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-sm' : 'text-gray-400 bg-transparent cursor-not-allowed opacity-50'}`}>
                      <AiOutlineSend size={18} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4">
                  <AiOutlineSend size={32} />
                </div>
                <h2 className="text-base font-semibold text-gray-800">Your Chat Messages</h2>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px]">Select a seller from the conversations list to begin chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConversationCard = ({ data, me, online, active, onClick, setUserData, setActiveStatus }) => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const shopId = data.members.find((m) => m !== me);
    const fetchShop = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${shopId}`);
        setShop(res.data.shop);
      } catch (error) { }
    };
    fetchShop();
  }, [me, data]);

  const onCardClick = () => {
    onClick();
    if (shop) setUserData(shop);
    setActiveStatus(online);
  };

  return (
    <div
      onClick={onCardClick}
      className={`
        px-6 py-4 flex items-center gap-3 cursor-pointer border-b border-gray-150 relative transition
        ${active ? "bg-teal-50/50" : "bg-white hover:bg-gray-50/50"}
      `}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-700" />}
      <div className="relative flex-shrink-0">
        <img src={shop?.avatar?.url || "/placeholder.png"} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-200" />
        <div className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-800 truncate">{shop?.name}</h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {data.lastMessageId === me ? 'You: ' : ''}{data.lastMessage}
        </p>
      </div>
      <div className="text-[10px] text-gray-400 whitespace-nowrap self-start mt-0.5">
        {format(data.updatedAt).split(' ')[0]}
      </div>
    </div>
  );
};

const MessageBubble = ({ item, me, userData }) => {
  const isMe = item.sender === me;
  return (
    <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img src={userData?.avatar?.url || "/placeholder.png"} className="w-7 h-7 rounded-lg object-cover mr-2 self-end border border-gray-200 shadow-sm" alt="" />
      )}
      <div className="max-w-[75%] space-y-1">
        {item.images && (
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-1 bg-white">
            <img src={item.images?.url || item.images} alt="" className="w-full max-h-60 object-cover" />
          </div>
        )}
        {item.text && (
          <div className={`
            px-4 py-2.5 rounded-xl shadow-sm text-sm leading-relaxed
            ${isMe ?
              'bg-teal-700 text-white rounded-tr-none' :
              'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }
          `}>
            <p className="font-medium whitespace-pre-wrap">{item.text}</p>
          </div>
        )}
        <p className={`text-[10px] text-gray-400 px-1 mt-0.5 ${isMe ? 'text-right' : 'text-left'}`}>
          {format(item.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default UserInboxPage;
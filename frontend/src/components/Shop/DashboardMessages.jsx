import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
import { server, socket_server } from "../../server";
import { BsArrowLeft } from "react-icons/bs";
import { ui } from "../../styles/theme";

const ENDPOINT = socket_server;
const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        images: data.images || null,
      });
    });

    socket.on("getLastMessage", ({ lastMessage, lastMessageId }) => {
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
    const getConversations = async () => {
      if (!seller?._id) return;
      try {
        const res = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, { withCredentials: true });
        setConversations(res.data.conversations);
      } catch (error) { }
    };
    getConversations();
  }, [seller]);

  useEffect(() => {
    if (seller?._id) {
      socket.emit("addUser", seller._id);
      socket.on("getUsers", (data) => setOnlineUsers(data));
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((m) => m !== seller._id);
    return onlineUsers.some((u) => u.userId === chatMember);
  };

  useEffect(() => {
    if (currentChat) {
      setActiveStatus(onlineCheck(currentChat));
      const fetchUserData = async () => {
        const userId = currentChat.members.find((m) => m !== seller?._id);
        try {
          const res = await axios.get(`${server}/user/user-info/${userId}`);
          setUserData(res.data.user);
        } catch (error) { console.log(error); }
      };
      fetchUserData();
    }
  }, [onlineUsers, currentChat, seller]);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;
      try {
        const res = await axios.get(`${server}/messages/get-all-messages/${currentChat._id}`);
        setMessages(res.data.messages);
      } catch (error) { }
    };
    getMessages();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !images) return;

    const receiverId = currentChat.members.find((m) => m !== seller._id);
    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      images: images || null,
    });

    try {
      const res = await axios.post(`${server}/messages/create-new-message`, {
        sender: seller._id,
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
        lastMessageId: seller._id,
      });
      socket.emit("updateLastMessage", { lastMessage: lastMsg, lastMessageId: seller._id });
      setConversations((prev) =>
        prev.map((conv) => (conv._id === currentChat._id ? { ...conv, lastMessage: lastMsg, lastMessageId: seller._id } : conv))
      );
    } catch (error) { }
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImages(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`${ui.card} h-[80vh] overflow-hidden flex relative animate-in fade-in duration-700`}>

      {/* Sidebar: Conversation List */}
      <div className={`
         w-full md:w-[320px] flex flex-col border-r border-gray-200 bg-gray-50/50 transition-all duration-500 shrink-0
         ${open ? "hidden md:flex" : "flex"}
      `}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Shop Inbox</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage conversations with customers</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((conv, idx) => (
            <MessageList
              key={idx}
              data={conv}
              me={seller?._id}
              online={onlineCheck(conv)}
              active={currentChat?._id === conv._id}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              setUserData={setUserData}
              setActiveStatus={setActiveStatus}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Main Message View */}
      <div className={`
         flex-1 flex flex-col bg-white transition-all duration-500
         ${open ? "flex" : "hidden md:flex"}
      `}>
        {currentChat && userData ? (
          <>
            <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 mr-1">
                  <BsArrowLeft size={20} />
                </button>
                <div className="relative">
                  <img src={userData?.avatar?.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${activeStatus ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{userData?.name}</h3>
                  <p className="text-[10px] text-gray-500">{activeStatus ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
            >
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} msg={msg} sellerId={seller._id} userData={userData} me={seller._id} />
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 relative">
              {images && (
                <div className="absolute bottom-full left-4 mb-3 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 w-24 aspect-square shadow-md">
                    <img src={images} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setImages(null)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                  </div>
                </div>
              )}
              <form onSubmit={sendMessageHandler} className="flex items-center gap-2">
                <label className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-teal-700 rounded-lg cursor-pointer hover:bg-gray-100 transition shrink-0">
                  <TfiGallery size={18} />
                  <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
                <input
                  type="text"
                  placeholder="Enter your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={ui.input}
                />
                <button type="submit" disabled={!newMessage.trim() && !images} className={`${ui.btnPrimary} shrink-0 !py-2.5`}>
                  <AiOutlineSend size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
              <AiOutlineSend size={28} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">No conversation selected</h2>
            <p className="text-xs text-gray-500 mt-1">Select a customer from the inbox list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList = ({ data, setOpen, setCurrentChat, me, setUserData, online, setActiveStatus, isLoading, active }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = data.members.find((m) => m !== me);
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) { }
    };
    fetchUser();
  }, [me, data]);

  const handleClick = () => {
    navigate(`/dashboard-messages?${data._id}`);
    setOpen(true);
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
  };

  return (
    <div
      onClick={handleClick}
      className={`px-5 py-4 flex items-center gap-3 cursor-pointer transition relative ${active ? "bg-teal-50/60" : "hover:bg-gray-50"}`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-700" />}
      <div className="relative shrink-0">
        <img src={user?.avatar?.url || user?.avatar} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-200" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">{user?.name}</h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {!isLoading && data?.lastMessageId === me ? "You: " : ""}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ msg, sellerId, userData, me }) => {
  const isMe = msg.sender === me;
  return (
    <div className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img src={userData?.avatar?.url} className="w-8 h-8 rounded-lg object-cover mr-2.5 self-end" alt="" />
      )}
      <div className="max-w-[70%] space-y-1">
        {msg.images && (
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-1 max-w-xs">
            <img src={msg.images?.url || msg.images} alt="" className="w-full max-h-60 object-cover" />
          </div>
        )}
        {msg.text && (
          <div className={`p-3 rounded-xl text-sm ${isMe ? 'bg-teal-700 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
            <p className="leading-relaxed">{msg.text}</p>
          </div>
        )}
        <p className={`text-[9px] text-gray-400 mt-0.5 ${isMe ? 'text-right' : 'text-left'}`}>
          {format(msg.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default DashboardMessages;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend, AiOutlinePaperClip } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
import { server, socket_server } from "../../server";
import { BsArrowLeft } from "react-icons/bs";

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
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 h-[85vh] bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-3xl border border-white overflow-hidden flex relative animate-in fade-in duration-700">

      {/* Sidebar: Conversation List */}
      <div className={`
         w-full md:w-[400px] flex flex-col border-r border-white bg-white/20 transition-all duration-500
         ${open ? "hidden md:flex" : "flex"}
      `}>
        <div className="p-8 border-b border-white">
          <h2 className="text-2xl font-black text-[#16697A] tracking-tighter italic uppercase">Shop Inbox</h2>
          <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em] mt-1">Manage your messages</p>
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
         flex-1 flex flex-col bg-white/10 transition-all duration-500
         ${open ? "flex" : "hidden md:flex"}
      `}>
        {currentChat && userData ? (
          <>
            <div className="h-24 px-8 border-b border-white flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setOpen(false)} className="md:hidden w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#16697A]">
                  <BsArrowLeft size={20} />
                </button>
                <div className="relative">
                  <img src={userData?.avatar?.url} alt="" className="w-12 h-12 rounded-[18px] object-cover ring-2 ring-white shadow-md" />
                  {activeStatus && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />}
                </div>
                <div>
                  <h3 className="font-black text-[#16697A] tracking-tight truncate max-w-[200px] uppercase">{userData?.name}</h3>
                  <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-widest leading-none">{activeStatus ? "Active Now" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} msg={msg} sellerId={seller._id} userData={userData} me={seller._id} />
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-8 relative">
              {images && (
                <div className="absolute bottom-full left-8 mb-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white w-32 aspect-square">
                    <img src={images} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setImages(null)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full">×</button>
                  </div>
                </div>
              )}
              <form onSubmit={sendMessageHandler} className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white p-2 flex items-center shadow-xl">
                <label className="w-12 h-12 flex items-center justify-center text-[#16697A] hover:bg-[#EDE7E3] rounded-2xl cursor-pointer transition-colors">
                  <TfiGallery size={18} />
                  <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
                <input
                  type="text"
                  placeholder="Enter your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 font-bold text-[#16697A] placeholder:text-[#16697A]/20 outline-none bg-transparent"
                />
                <button type="submit" className={`p-3 rounded-2xl transition-all duration-300 ${newMessage.trim() || images ? 'bg-[#16697A] text-white shadow-lg' : 'text-[#6B7280] bg-transparent opacity-20'}`}>
                  <AiOutlineSend size={22} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-[#EDE7E3] rounded-[40px] flex items-center justify-center text-[#16697A]/20 mb-8 transform -rotate-12">
              <AiOutlineSend size={48} />
            </div>
            <h2 className="text-xl font-black text-[#16697A] tracking-tighter italic">Shop Inbox</h2>
            <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em] mt-2">Select a chat to start messaging</p>
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
      className={`px-8 py-6 flex items-center gap-4 cursor-pointer transition-all duration-500 relative group ${active ? "bg-white/60 shadow-inner" : "hover:bg-white/30"}`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#FFA62B] rounded-r-full" />}
      <div className="relative">
        <img src={user?.avatar?.url || user?.avatar} alt="" className="w-14 h-14 rounded-[20px] object-cover ring-2 ring-white shadow-md transform group-hover:scale-105 transition-transform" />
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${online ? 'bg-green-400' : 'bg-[#c7b9b9]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-[#16697A] tracking-tight truncate uppercase italic">{user?.name}</h4>
        <p className="text-xs font-bold text-[#6B7280] truncate mt-0.5 opacity-60">
          {!isLoading && data?.lastMessageId === me ? "Merchant: " : ""}
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
        <img src={userData?.avatar?.url} className="w-8 h-8 rounded-xl object-cover mr-3 shadow-md border-2 border-white self-end" alt="" />
      )}
      <div className="max-w-[70%] space-y-1">
        {msg.images && (
          <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-2xl mb-2">
            <img src={msg.images?.url || msg.images} alt="" className="w-full max-h-80 object-cover" />
          </div>
        )}
        {msg.text && (
          <div className={`p-5 rounded-[24px] shadow-sm transform transition-all ${isMe ? 'bg-[#16697A] text-white rounded-tr-none translate-x-1' : 'bg-white text-[#16697A] rounded-tl-none border border-white'}`}>
            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
          </div>
        )}
        <p className={`text-[9px] font-black text-[#6B7280] uppercase tracking-[0.3em] px-2 ${isMe ? 'text-right' : 'text-left'}`}>
          {format(msg.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default DashboardMessages;
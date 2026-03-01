import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend, AiOutlinePaperClip } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { BsArrowLeft } from "react-icons/bs";

const ENDPOINT = "https://tania-socket-working.onrender.com";
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
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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
    <div className="bg-[#EDE7E3] min-h-screen font-Inter">
      <Header />
      <div className="max-w-[1400px] mx-auto py-10 px-4 md:px-8">
        <div className="h-[80vh] bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-3xl border border-white overflow-hidden flex relative">

          {/* Sidebar: Conversation List */}
          <div className={`
             w-full md:w-[400px] flex flex-col border-r border-white bg-white/20 transition-all duration-500
             ${open ? "hidden md:flex" : "flex"}
          `}>
            <div className="p-8 border-b border-white">
              <h2 className="text-2xl font-black text-[#16697A] tracking-tighter italic">CHANNELS</h2>
              <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em] mt-1">Merchant Comms Hub</p>
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
                <div className="p-12 text-center">
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest opacity-50">No Active Transmissions</p>
                </div>
              )}
            </div>
          </div>

          {/* Main: Message Area */}
          <div className={`
             flex-1 flex flex-col bg-white/10 transition-all duration-500
             ${open ? "flex" : "hidden md:flex"}
          `}>
            {currentChat ? (
              <>
                {/* Chat Header */}
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
                      <h3 className="font-black text-[#16697A] tracking-tight">{userData?.name}</h3>
                      <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-widest">{activeStatus ? "Authorized & Active" : "Standby Mode"}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {messages.map((item, index) => (
                    <MessageBubble
                      key={index}
                      item={item}
                      me={user?._id}
                      userData={userData}
                      isImage={!!item.images}
                    />
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 relative">
                  {images && (
                    <div className="absolute bottom-full left-8 mb-4 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white w-32 aspect-square">
                        <img src={images} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setImages(null)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">×</button>
                      </div>
                    </div>
                  )}
                  <form onSubmit={sendMessageHandler} className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white p-2 flex items-center shadow-xl">
                    <label className="w-14 h-14 flex items-center justify-center text-[#16697A] hover:bg-[#EDE7E3] rounded-2xl cursor-pointer transition-colors">
                      <AiOutlinePaperClip size={24} />
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    <input
                      type="text"
                      placeholder="Transmit high-priority data..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 font-bold text-[#16697A] placeholder:text-[#16697A]/20 outline-none bg-transparent"
                    />
                    <button type="submit" className={`p-4 rounded-2xl transition-all duration-300 ${newMessage.trim() || images ? 'bg-[#16697A] text-white shadow-lg rotate-[360deg]' : 'text-[#6B7280] bg-transparent opacity-20 cursor-not-allowed'}`}>
                      <AiOutlineSend size={24} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-[#EDE7E3] rounded-[40px] flex items-center justify-center text-[#16697A]/20 mb-8 transform rotate-12">
                  <AiOutlineSend size={48} />
                </div>
                <h2 className="text-xl font-black text-[#16697A] tracking-tighter italic">SECURE COMMS IDLE</h2>
                <p className="text-[10px] font-black text-[#489FB5] uppercase tracking-[0.4em] mt-2">Select a channel to begin transmission</p>
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
        px-8 py-6 flex items-center gap-4 cursor-pointer transition-all duration-500 relative group
        ${active ? "bg-white/60 shadow-inner" : "hover:bg-white/30"}
      `}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#FFA62B] rounded-r-full" />}
      <div className="relative">
        <img src={shop?.avatar?.url} alt="" className="w-14 h-14 rounded-[20px] object-cover ring-2 ring-white shadow-md transform group-hover:scale-105 transition-transform" />
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${online ? 'bg-green-400' : 'bg-[#c7b9b9]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-[#16697A] tracking-tight truncate uppercase">{shop?.name}</h4>
        <p className="text-xs font-bold text-[#6B7280] truncate mt-0.5 opacity-60 italic">
          {data.lastMessageId === me ? 'Sent: ' : ''}{data.lastMessage}
        </p>
      </div>
      <div className="text-[10px] font-black text-[#82C0CC] uppercase tracking-tighter">
        {format(data.updatedAt).split(' ')[0]}
      </div>
    </div>
  );
};

const MessageBubble = ({ item, me, userData, isImage }) => {
  const isMe = item.sender === me;
  return (
    <div className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <img src={userData?.avatar?.url} className="w-8 h-8 rounded-xl object-cover mr-3 shadow-md border-2 border-white self-end" alt="" />
      )}
      <div className={`max-w-[70%] space-y-1`}>
        {item.images && (
          <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-2xl mb-2">
            <img src={item.images?.url || item.images} alt="" className="w-full max-h-80 object-cover" />
          </div>
        )}
        {item.text && (
          <div className={`
                p-5 rounded-[24px] shadow-sm transform transition-all
                ${isMe ?
              'bg-[#16697A] text-white rounded-tr-none translate-x-1' :
              'bg-white text-[#16697A] rounded-tl-none border border-white'
            }
             `}>
            <p className="text-sm font-bold leading-relaxed">{item.text}</p>
          </div>
        )}
        <p className={`text-[9px] font-black text-[#6B7280] uppercase tracking-[0.2em] px-2 ${isMe ? 'text-right' : 'text-left'}`}>
          {format(item.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default UserInboxPage;
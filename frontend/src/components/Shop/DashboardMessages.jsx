import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
import styles from "../../styles/styles";
import { server, socket_server } from "../../server";

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

  // Receive incoming messages
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        images: data.images || null,
      });
    });
  }, []);

  // Listen for last message updates
  useEffect(() => {
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

  // Append arrival message if belongs to current chat
  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Fetch all seller conversations
  useEffect(() => {
    const getConversations = async () => {
      if (!seller?._id) return;
      try {
        const res = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller._id}`,
          { withCredentials: true }
        );
        setConversations(res.data.conversations);
      } catch (error) {
        console.error(error);
      }
    };
    getConversations();
  }, [seller]);

  // Setup socket online users
  useEffect(() => {
    if (!seller?._id) return;
    socket.emit("addUser", seller._id);
    socket.on("getUsers", (data) => {
      setOnlineUsers(data);
    });
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((m) => m !== seller._id);
    return onlineUsers.some((user) => user.userId === chatMember);
  };

  // Fetch messages of current chat
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;
      try {
        const res = await axios.get(`${server}/messages/get-all-messages/${currentChat._id}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    getMessages();
  }, [currentChat]);

  // Send new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !images) return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
      images: images || null,
    };

    const receiverId = currentChat.members.find((m) => m !== seller._id);

    // Send via socket
    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      images: images || null,
    });

    try {
      const res = await axios.post(`${server}/messages/create-new-message`, message);
      setMessages([...messages, res.data.message]);
      
      // Clear input fields immediately after sending
      setNewMessage("");
      setImages(null);

      // Update last message in conversation
      const lastMsg = images ? "Photo" : newMessage;
      await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: lastMsg,
        lastMessageId: seller._id,
      });

      // Emit socket event to update conversations in real-time
      socket.emit("updateLastMessage", {
        lastMessage: lastMsg,
        lastMessageId: seller._id,
      });

      // Update local conversation state
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === currentChat._id
            ? { ...conv, lastMessage: lastMsg, lastMessageId: seller._id }
            : conv
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImages(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // Scroll to last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
          {conversations.map((conv, idx) => (
            <MessageList
              key={idx}
              data={conv}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={seller._id}
              setUserData={setUserData}
              online={onlineCheck(conv)}
              setActiveStatus={setActiveStatus}
              isLoading={isLoading}
            />
          ))}
        </>
      )}

      {open && currentChat && userData && (
        <SellerInbox
          scrollRef={scrollRef}
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({ data, setOpen, setCurrentChat, me, setUserData, online, setActiveStatus, isLoading }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = data.members.find((m) => m !== me);
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
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
      className="w-full flex p-3 cursor-pointer hover:bg-[#00000010]"
      onClick={handleClick}
    >
      <div className="relative">
        <img src={user?.avatar?.url} alt="" className="w-[50px] h-[50px] rounded-full" />
        <div
          className={`w-3 h-3 rounded-full absolute top-0.5 right-0.5 ${
            online ? "bg-green-400" : "bg-[#c7b9b9]"
          }`}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && data?.lastMessageId === me
            ? "You: "
            : `${user?.name ? user.name.split(" ")[0] : ""}: `}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({ scrollRef, setOpen, newMessage, setNewMessage, sendMessageHandler, messages, sellerId, userData, activeStatus, handleImageUpload }) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* Header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img src={userData?.avatar?.url} alt="" className="w-[60px] h-[60px] rounded-full" />
          <div className="pl-3">
            <h1 className="text-[18px] font-semibold">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      {/* Messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full my-2 ${msg.sender === sellerId ? "justify-end" : "justify-start"}`}
            ref={scrollRef}
          >
            {msg.sender !== sellerId && (
              <img src={userData?.avatar?.url} alt="" className="w-10 h-10 rounded-full mr-3" />
            )}
            {msg.images && (
              <img src={msg.images} className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2" />
            )}
            {msg.text && (
              <div>
                <div className={`w-max p-2 rounded ${msg.sender === sellerId ? "bg-black" : "bg-[#38c776]"} text-white h-min`}>
                  <p>{msg.text}</p>
                </div>
                <p className="text-[12px] text-[#000000d3] pt-1">{format(msg.createdAt)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form className="p-3 relative w-full flex justify-between items-center" onSubmit={sendMessageHandler}>
        <div className="w-[30px]">
          <input type="file" id="image" className="hidden" onChange={handleImageUpload} />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
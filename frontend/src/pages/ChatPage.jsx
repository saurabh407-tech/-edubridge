import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Send, Search, MessageSquare, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { setMessages, addMessage, resetUnreadMessages } from "../store/slices/chatSlice";
import { getSocket } from "../services/socket";
import { Avatar } from "../components/common";
import { formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { messages, onlineUsers, typingUsers } = useSelector(s => s.chat);

  const [activeUserId, setActiveUserId] = useState(paramUserId || null);
  const [activeUser, setActiveUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [searchConv, setSearchConv] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);
  const socket = getSocket();

  const conversationId = activeUserId
    ? [user._id, activeUserId].sort().join("_")
    : null;
  const currentMessages = conversationId ? messages[conversationId] || [] : [];

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get("/messages");
        // Populate other user info for each conversation
        const convsWithUsers = await Promise.all(
          (data.data || []).map(async (conv) => {
            try {
              const convId = conv._id || conv.lastMessage?.conversationId;
              if (!convId) return conv;
              const parts = convId.split("_");
              const otherId = parts.find(id => id !== user._id);
              if (!otherId) return conv;
              const userRes = await api.get(`/users/${otherId}`);
              return { ...conv, otherUser: userRes.data.data, otherId };
            } catch {
              return conv;
            }
          })
        );
        setConversations(convsWithUsers);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, [user._id]);

  // Fetch active user info + messages
  useEffect(() => {
    if (!activeUserId) return;

    const fetchUserAndMessages = async () => {
  setLoadingMessages(true);
  // Message padhte hi unread count reset karo
  dispatch(resetUnreadMessages());
  try {
        // Fetch user info
        const userRes = await api.get(`/users/${activeUserId}`);
        setActiveUser(userRes.data.data);

        // Fetch messages
        const msgRes = await api.get(`/messages/${activeUserId}`);
        const convId = [user._id, activeUserId].sort().join("_");
        dispatch(setMessages({ conversationId: convId, messages: msgRes.data.data || [] }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

   fetchUserAndMessages();

// Socket se bhi mark read karo
const socket = getSocket();
if (socket && activeUserId) {
  const convId = [user._id, activeUserId].sort().join("_");
  socket.emit("markRead", { conversationId: convId });
}
}, [activeUserId, user._id, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Handle conversation click
  const handleConversationClick = (conv) => {
    const otherId = conv.otherId || conv.otherUser?._id;
    if (otherId) {
      setActiveUserId(otherId);
      navigate(`/chat/${otherId}`, { replace: true });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUserId || !socket) return;

    socket.emit("sendMessage", { receiverId: activeUserId, content: input.trim() });

    // Optimistically add message
    dispatch(addMessage({
      _id: Date.now().toString(),
      conversationId,
      sender: { _id: user._id, name: user.name, profilePhoto: user.profilePhoto },
      receiver: activeUserId,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    }));

    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (socket && activeUserId) {
      socket.emit("typing", { receiverId: activeUserId, isTyping: true });
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit("typing", { receiverId: activeUserId, isTyping: false });
      }, 1000);
    }
  };

  const isOnline = (uid) => onlineUsers.includes(uid);
  const isTyping = activeUserId && typingUsers[activeUserId];

  const filteredConversations = conversations.filter(conv => {
    if (!searchConv) return true;
    const name = conv.otherUser?.name || "";
    return name.toLowerCase().includes(searchConv.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">

      {/* Sidebar — Conversations list */}
      <div className={`flex flex-col border-r border-slate-100 dark:border-slate-700 flex-shrink-0
        ${activeUserId ? "hidden md:flex w-80" : "flex w-full md:w-80"}`}>

        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              className="input pl-8 text-sm py-2"
              placeholder="Search conversations…"
              value={searchConv}
              onChange={e => setSearchConv(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-slate-200 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv, idx) => {
              const otherId = conv.otherId || conv.otherUser?._id;
              const isActive = activeUserId === otherId;
              const lastMsg = conv.lastMessage;

              return (
                <button
                  key={conv._id || idx}
                  onClick={() => handleConversationClick(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left
                    ${isActive ? "bg-primary-50 dark:bg-primary-900/20" : ""}`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={conv.otherUser?.profilePhoto}
                      name={conv.otherUser?.name || "U"}
                      size="md"
                    />
                    {isOnline(otherId) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {conv.otherUser?.name || "Unknown User"}
                      </p>
                      {lastMsg?.createdAt && (
                        <p className="text-xs text-slate-400 flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 truncate">
                        {lastMsg?.content || "Start a conversation"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeUserId ? (
        <div className={`flex-1 flex flex-col ${activeUserId ? "flex" : "hidden md:flex"}`}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
            <button
  onClick={() => { setActiveUserId(null); navigate("/chat"); }}
  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 mr-1"
  title="Back to conversations">
  <ArrowLeft className="w-5 h-5 text-slate-500" />
</button>

            {activeUser ? (
              <>
                <div className="relative">
                  <Avatar src={activeUser.profilePhoto} name={activeUser.name} size="md" />
                  {isOnline(activeUserId) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{activeUser.name}</p>
                  <p className="text-xs text-slate-500">
                    {isTyping ? (
                      <span className="text-primary-500 animate-pulse">typing…</span>
                    ) : isOnline(activeUserId) ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      `${activeUser.branch || ""} ${activeUser.collegeName ? "• " + activeUser.collegeName : ""}`
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 animate-pulse" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-10 h-10 text-slate-200 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No messages yet — say hello!</p>
              </div>
            ) : (
              currentMessages.map((msg, i) => {
                const isMine = msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div key={msg._id || i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    {!isMine && (
                      <Avatar
                        src={activeUser?.profilePhoto}
                        name={activeUser?.name}
                        size="sm"
                        className="mr-2 flex-shrink-0 self-end"
                      />
                    )}
                    <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm
                      ${isMine
                        ? "bg-primary-600 text-white rounded-br-sm ml-2"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm"}`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMine ? "text-primary-200" : "text-slate-400"}`}>
                        {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }) : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSend} className="px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Type a message…"
                value={input}
                onChange={handleTyping}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary px-4 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* No conversation selected — show on desktop */
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
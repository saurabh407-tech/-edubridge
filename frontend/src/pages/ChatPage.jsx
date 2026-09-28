import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Send,
  Search,
  MessageSquare,
  ArrowLeft,
  Phone,
  Video,
  Info,
  Smile,
  MoreHorizontal,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  X,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Users,
  Shield,
  Clock
} from "lucide-react";
import api from "../services/api";
import {
  setMessages,
  addMessage,
  resetUnreadMessages,
} from "../store/slices/chatSlice";
import { getSocket } from "../services/socket";
import { Avatar } from "../components/common";
import { formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { messages, onlineUsers, typingUsers } = useSelector((s) => s.chat);

  const [activeUserId, setActiveUserId] = useState(paramUserId || null);
  const [activeUser, setActiveUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [input, setInput] = useState("");
  const [searchConv, setSearchConv] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);
  const socket = getSocket();

  // Consistent conversation identifier
  const conversationId = activeUserId
    ? [user?._id, activeUserId].sort().join("_")
    : null;

  const currentMessages = conversationId ? messages[conversationId] || [] : [];

  /* =====================================================
     FETCH CONVERSATIONS
  ===================================================== */
  useEffect(() => {
    if (!user?._id) return;

    const fetchConversations = async () => {
      try {
        const { data } = await api.get("/messages");
        const convsWithUsers = await Promise.all(
          (data.data || []).map(async (conv) => {
            try {
              const convId = conv._id || conv.lastMessage?.conversationId;
              if (!convId) return conv;

              const parts = convId.split("_");
              const otherId = parts.find((id) => id !== user._id);
              if (!otherId) return conv;

              const userRes = await api.get(`/users/${otherId}`);
              return {
                ...conv,
                otherUser: userRes.data.data,
                otherId,
              };
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
  }, [user?._id]);

  /* =====================================================
     FETCH ACTIVE USER + MESSAGES
  ===================================================== */
  useEffect(() => {
    if (!activeUserId || !user?._id) return;

    const fetchUserAndMessages = async () => {
      setLoadingMessages(true);
      dispatch(resetUnreadMessages());

      try {
        const userRes = await api.get(`/users/${activeUserId}`);
        setActiveUser(userRes.data.data);

        const msgRes = await api.get(`/messages/${activeUserId}`);
        const convId = [user._id, activeUserId].sort().join("_");

        dispatch(
          setMessages({
            conversationId: convId,
            messages: msgRes.data.data || [],
          })
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchUserAndMessages();

    if (socket) {
      const convId = [user._id, activeUserId].sort().join("_");
      socket.emit("markRead", { conversationId: convId });
    }
  }, [activeUserId, user?._id, dispatch]);

  /* =====================================================
     SCROLL TO BOTTOM
  ===================================================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  /* =====================================================
     CONVERSATION CLICK
  ===================================================== */
  const handleConversationClick = (conv) => {
    const otherId = conv.otherId || conv.otherUser?._id;
    if (otherId) {
      setActiveUserId(otherId);
      navigate(`/chat/${otherId}`, { replace: true });
    }
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUserId || !socket) return;

    const content = input.trim();

    socket.emit("sendMessage", {
      receiverId: activeUserId,
      content,
    });

    // Optimistic message
    dispatch(
      addMessage({
        _id: Date.now().toString(),
        conversationId,
        sender: {
          _id: user._id,
          name: user.name,
          profilePhoto: user.profilePhoto,
        },
        receiver: activeUserId,
        content,
        createdAt: new Date().toISOString(),
      })
    );

    setInput("");
    socket.emit("typing", {
      receiverId: activeUserId,
      isTyping: false,
    });
  };

  /* =====================================================
     TYPING INDICATOR
  ===================================================== */
  const handleTyping = (e) => {
    const value = e.target.value;
    setInput(value);

    if (socket && activeUserId) {
      socket.emit("typing", {
        receiverId: activeUserId,
        isTyping: true,
      });

      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit("typing", {
          receiverId: activeUserId,
          isTyping: false,
        });
      }, 1000);
    }
  };

  const isOnline = (uid) => onlineUsers?.includes(uid);
  const isTyping = activeUserId && typingUsers?.[activeUserId];

  const filteredConversations = conversations.filter((conv) => {
    if (!searchConv) return true;
    const name = conv.otherUser?.name || "";
    return name.toLowerCase().includes(searchConv.toLowerCase());
  });

  const closeChat = () => {
    setActiveUserId(null);
    setActiveUser(null);
    navigate("/chat");
  };

  return (
    <div className="h-[calc(100vh-6rem)] min-h-[580px] max-w-7xl mx-auto flex overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card animate-fade-in font-sans">
      {/* =====================================================
          CONVERSATION SIDEBAR (DESKTOP + MOBILE)
      ====================================================== */}
      <aside
        className={`flex flex-col w-full md:w-80 lg:w-96 border-r border-slate-200/80 bg-white flex-shrink-0 transition-all ${
          activeUserId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg text-slate-900">
                Messages
              </h1>
              {conversations.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                  {conversations.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-600">
              Peer Network
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-800 placeholder-slate-600 outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition-all"
            />
            {searchConv && (
              <button
                onClick={() => setSearchConv("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-600 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">No chats yet</p>
              <p className="text-[11px] text-slate-600 mt-1 max-w-[200px] leading-relaxed">
                Connect with teammates on project pages or book a mentor session to start chatting.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv, idx) => {
              const otherId = conv.otherId || conv.otherUser?._id;
              const isActive = activeUserId === otherId;
              const lastMsg = conv.lastMessage;
              const unread = conv.unreadCount || 0;

              return (
                <button
                  key={conv._id || idx}
                  onClick={() => handleConversationClick(conv)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150 ${
                    isActive
                      ? "bg-primary-50/80 border border-primary-100 shadow-2xs"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {/* Avatar & Online Dot */}
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={conv.otherUser?.profilePhoto}
                      name={conv.otherUser?.name || "Student"}
                      size="md"
                    />
                    {isOnline(otherId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          isActive || unread > 0
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {conv.otherUser?.name || "Student"}
                      </p>
                      {lastMsg?.createdAt && (
                        <span className="text-[10px] font-medium text-slate-600 flex-shrink-0">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-[11px] truncate ${
                          unread > 0 ? "font-semibold text-slate-800" : "text-slate-600"
                        }`}
                      >
                        {lastMsg?.content || "Start conversation…"}
                      </p>
                      {unread > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold min-w-[16px] text-center flex-shrink-0">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* =====================================================
          MAIN CHAT PANE
      ====================================================== */}
      {!activeUserId ? (
        /* Empty Desktop State */
        <main className="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-slate-50/50 text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-card">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-lg text-slate-900">
            Select a Conversation
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
            Chat in real-time with your classmates, project partners, and mentors across colleges.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-semibold text-slate-700 mt-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Real-time instant communication</span>
          </div>
        </main>
      ) : (
        /* Active Chat Workspace */
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/40">
          {/* Header */}
          <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between flex-shrink-0 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back on Mobile */}
              <button
                onClick={closeChat}
                className="md:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {activeUser ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={activeUser.profilePhoto}
                      name={activeUser.name}
                      size="md"
                    />
                    {isOnline(activeUserId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm text-slate-900 truncate">
                      {activeUser.name}
                    </h2>
                    <p className="text-[11px] truncate flex items-center gap-1">
                      {isTyping ? (
                        <span className="font-bold text-primary-600 animate-pulse">
                          typing a message…
                        </span>
                      ) : isOnline(activeUserId) ? (
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active now</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          {activeUser.branch || "Student"}
                          {activeUser.collegeName ? ` • ${activeUser.collegeName}` : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
                  <div className="w-28 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-xl transition-colors ${
                  showInfo
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
                title="Student Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Info Drawer (Collapsible) */}
          {showInfo && activeUser && (
            <div className="p-4 bg-primary-50/50 border-b border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-down">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeUser.profilePhoto}
                  name={activeUser.name}
                  size="md"
                />
                <div>
                  <p className="font-bold text-xs text-slate-900">{activeUser.name}</p>
                  <p className="text-[11px] text-slate-600">
                    {activeUser.branch || "Engineering"} • Semester {activeUser.semester || "1"} •{" "}
                    {activeUser.collegeName || "Campus"}
                  </p>
                </div>
              </div>

              <Link
                to={`/profile/${activeUser._id}`}
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <span>View Full Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-600">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading messages…</span>
                </div>
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                {activeUser && (
                  <>
                    <Avatar
                      src={activeUser.profilePhoto}
                      name={activeUser.name}
                      size="lg"
                      className="mb-3 shadow-card"
                    />
                    <h3 className="font-display font-bold text-sm text-slate-900">
                      {activeUser.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-xs">
                      Send a message to start collaborating on notes, projects, or study plans!
                    </p>
                    <button
                      onClick={() => setInput("Hi! 👋 Ready to collaborate on EduBridge?")}
                      className="mt-3 px-3.5 py-1.5 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-200 shadow-2xs transition-all"
                    >
                      Say Hello 👋
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl mx-auto">
                {currentMessages.map((msg, idx) => {
                  const isMine = msg.sender?._id === user._id || msg.sender === user._id;

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex items-end gap-2 group ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Other User Avatar */}
                      {!isMine && (
                        <Avatar
                          src={activeUser?.profilePhoto}
                          name={activeUser?.name}
                          size="sm"
                          className="flex-shrink-0 mb-1"
                        />
                      )}

                      {/* Bubble */}
                      <div
                        className={`flex flex-col max-w-[78%] sm:max-w-[65%] ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? "bg-primary-600 text-white rounded-2xl rounded-br-xs shadow-xs"
                              : "bg-white border border-slate-200/80 text-slate-800 rounded-2xl rounded-bl-xs shadow-2xs"
                          }`}
                        >
                          <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        {/* Timestamp & Read Receipt */}
                        <div
                          className={`flex items-center gap-1 mt-1 text-[10px] text-slate-600 px-1 ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>
                            {msg.createdAt
                              ? formatDistanceToNow(new Date(msg.createdAt), {
                                  addSuffix: true,
                                })
                              : "just now"}
                          </span>
                          {isMine && <CheckCheck className="w-3 h-3 text-primary-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Typing Bubble */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar
                      src={activeUser?.profilePhoto}
                      name={activeUser?.name}
                      size="sm"
                      className="flex-shrink-0 mb-1"
                    />
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-white border border-slate-200 shadow-2xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Message Composer Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1 flex items-center rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:bg-white focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/15 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  placeholder="Type a message to collaborate…"
                  className="w-full h-11 bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-slate-600 outline-none"
                />

                {input.trim() && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="p-1.5 mr-2 rounded-lg text-slate-600 hover:text-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  input.trim()
                    ? "bg-primary-600 text-white shadow-card hover:shadow-card-hover hover:scale-105 active:scale-95"
                    : "bg-slate-100 text-slate-600 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}

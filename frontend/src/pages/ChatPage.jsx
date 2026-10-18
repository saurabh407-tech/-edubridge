import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Send,
  Search,
  MessageSquare,
  ArrowLeft,
  Info,
  Check,
  CheckCheck,
  X,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Users,
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
    <div className="h-[calc(100vh-7rem)] min-h-[580px] flex overflow-hidden rounded-3xl border border-[#EAE5D9] bg-white shadow-card">
      {/* =====================================================
          CONVERSATION SIDEBAR
      ====================================================== */}
      <aside
        className={`flex flex-col w-full md:w-80 lg:w-96 border-r border-[#EAE5D9] bg-white shrink-0 transition-all ${
          activeUserId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#F2EFE8] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-base text-slate-900">
                Direct Messages
              </h1>
              {conversations.length > 0 && (
                <span className="rounded-full bg-warm-100 border border-[#EAE5D9] px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {conversations.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Campus Peers
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-[#EAE5D9] bg-[#FAF9F5] text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
            {searchConv && (
              <button
                onClick={() => setSearchConv("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-warm-100 text-slate-500 border border-[#EAE5D9] flex items-center justify-center mb-3 shadow-2xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">No active messages</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Connect with project teammates, reserve books, or book a mentor to start collaborating.
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
                      ? "bg-warm-100 border border-[#EAE5D9] shadow-2xs"
                      : "hover:bg-[#FAF9F5] border border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={conv.otherUser?.profilePhoto}
                      name={conv.otherUser?.name || "Student"}
                      size="md"
                    />
                    {isOnline(otherId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          isActive || unread > 0
                            ? "font-bold text-slate-900 font-heading"
                            : "font-semibold text-slate-700 font-heading"
                        }`}
                      >
                        {conv.otherUser?.name || "Student"}
                      </p>
                      {lastMsg?.createdAt && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-[11px] truncate ${
                          unread > 0 ? "font-semibold text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {lastMsg?.content || "Start conversation…"}
                      </p>
                      {unread > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold min-w-[16px] text-center shrink-0">
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
        <main className="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-[#FAF9F5] text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#EAE5D9] text-slate-700 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-lg text-slate-900">
            Select a Peer Conversation
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
            Message in real-time with classmates, project teammates, and mentors across campus.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE5D9] text-[11px] font-semibold text-slate-700 mt-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Real-time instant collaboration</span>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5]">
          {/* Header */}
          <header className="h-16 px-4 sm:px-6 bg-white border-b border-[#EAE5D9] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={closeChat}
                className="md:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-warm-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {activeUser ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar
                      src={activeUser.profilePhoto}
                      name={activeUser.name}
                      size="md"
                    />
                    {isOnline(activeUserId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading font-bold text-sm text-slate-900 truncate">
                      {activeUser.name}
                    </h2>
                    <p className="text-[11px] truncate flex items-center gap-1">
                      {isTyping ? (
                        <span className="font-bold text-slate-900 animate-pulse">
                          typing a message…
                        </span>
                      ) : isOnline(activeUserId) ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active now</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {activeUser.branch || "Student"}
                          {activeUser.collegeName ? ` • ${activeUser.collegeName}` : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-xl transition-colors ${
                  showInfo
                    ? "bg-warm-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-warm-100"
                }`}
                title="Student Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Info Drawer */}
          {showInfo && activeUser && (
            <div className="p-4 bg-white border-b border-[#EAE5D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-down">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeUser.profilePhoto}
                  name={activeUser.name}
                  size="md"
                />
                <div>
                  <p className="font-bold font-heading text-xs text-slate-900">
                    {activeUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {activeUser.branch || "Student"} • Semester {activeUser.semester || "1"} •{" "}
                    {activeUser.collegeName || "Campus Member"}
                  </p>
                </div>
              </div>

              <Link
                to={`/profile/${activeUser._id}`}
                className="rounded-xl border border-[#EAE5D9] bg-warm-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-900 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs"
              >
                <span>View Student Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-500">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
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
                      className="mb-3 shadow-2xs ring-2 ring-[#EAE5D9]"
                    />
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {activeUser.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      Start collaborating on study materials, project milestones, or book exchanges!
                    </p>
                    <button
                      onClick={() => setInput("Hi! 👋 Ready to collaborate on EduBridge?")}
                      className="mt-3.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-warm-100 text-slate-800 text-xs font-semibold border border-[#EAE5D9] shadow-2xs transition-all"
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
                      {!isMine && (
                        <Avatar
                          src={activeUser?.profilePhoto}
                          name={activeUser?.name}
                          size="sm"
                          className="shrink-0 mb-1"
                        />
                      )}

                      <div
                        className={`flex flex-col max-w-[78%] sm:max-w-[65%] ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? "bg-slate-900 text-white rounded-2xl rounded-br-xs shadow-2xs"
                              : "bg-white border border-[#EAE5D9] text-slate-900 rounded-2xl rounded-bl-xs shadow-2xs"
                          }`}
                        >
                          <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        <div
                          className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1 ${
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
                          {isMine && <CheckCheck className="w-3 h-3 text-slate-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar
                      src={activeUser?.profilePhoto}
                      name={activeUser?.name}
                      size="sm"
                      className="shrink-0 mb-1"
                    />
                    <div className="px-3 py-2 rounded-2xl rounded-bl-xs bg-white border border-[#EAE5D9] shadow-2xs flex items-center gap-1">
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

          {/* Composer */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#EAE5D9]">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1 flex items-center rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] focus-within:bg-white focus-within:border-slate-900 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  placeholder="Type a message to collaborate…"
                  className="w-full h-11 bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                />

                {input.trim() && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="p-1.5 mr-2 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-slate-900 text-white shadow-2xs hover:bg-slate-800"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
                title="Send"
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

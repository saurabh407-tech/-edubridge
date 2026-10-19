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
  Paperclip,
  Smile,
  Mic,
  Play,
  Pause,
  Phone,
  Video,
  MoreVertical,
  BookMarked,
  FileText,
  Briefcase,
  Star,
  Award,
  ChevronRight,
  Plus
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

/* =========================================================
   AUDIO VOICE NOTE PREVIEW COMPONENT (From Reference UI)
========================================================= */
function AudioMessageBubble({ duration = "0:56", isMine = false, time = "10:15 pm" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={`p-3 rounded-2xl flex items-center gap-3 max-w-[280px] sm:max-w-[320px] shadow-md border ${
        isMine
          ? "bg-[#FBD784] text-[#0B1D26] border-[#FBD784] rounded-tr-xs"
          : "bg-[#0D202A] text-white border-white/15 rounded-tl-xs"
      }`}
    >
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
          isMine
            ? "bg-[#0B1D26] text-[#FBD784]"
            : "bg-[#FBD784] text-[#0B1D26]"
        }`}
        title={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
      </button>

      {/* Waveform Visualization Bars */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-0.5 h-6">
          {[40, 65, 30, 80, 50, 90, 70, 45, 85, 60, 95, 40, 75, 55, 35, 70, 85, 40, 60].map(
            (height, i) => (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className={`w-1 rounded-full transition-all ${
                  isMine
                    ? i < 9
                      ? "bg-[#0B1D26]"
                      : "bg-[#0B1D26]/35"
                    : i < 9
                    ? "bg-[#FBD784]"
                    : "bg-white/25"
                } ${isPlaying ? "animate-pulse" : ""}`}
              />
            )
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
          <span className={isMine ? "text-[#0B1D26]/80 font-bold" : "text-slate-400"}>
            {isPlaying ? "0:24" : duration}
          </span>
          <span className={isMine ? "text-[#0B1D26]/70 font-semibold" : "text-slate-400"}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

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
  const [showInfo, setShowInfo] = useState(true);

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
    e?.preventDefault();
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
    <div className="h-[calc(100vh-7.5rem)] min-h-[600px] flex overflow-hidden rounded-3xl border border-white/15 bg-[#0B1D26] shadow-2xl text-white relative">
      {/* =====================================================
          1. LEFT PANEL: CONVERSATION INBOX
      ====================================================== */}
      <aside
        className={`flex flex-col w-full md:w-80 lg:w-84 border-r border-white/10 bg-[#0D202A] shrink-0 transition-all ${
          activeUserId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Inbox Header */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-base text-white">
                Chat
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FBD784] px-2.5 py-0.5 text-[10px] font-bold text-[#0B1D26] shadow-xs">
                Inbox {conversations.length > 0 && `• ${conversations.length}`}
              </span>
            </div>

            <button
              onClick={() => navigate("/mentorship")}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
              title="Find New Peers"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-white/15 bg-[#0B1D26] text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-[#FBD784] focus:ring-2 focus:ring-[#FBD784]/20 transition-all"
            />
            {searchConv && (
              <button
                onClick={() => setSearchConv("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
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
              <div className="w-12 h-12 rounded-2xl bg-[#0B1D26] text-[#FBD784] border border-white/15 flex items-center justify-center mb-3 shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white">No active messages</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
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
                      ? "bg-[#0B1D26] border-l-4 border-l-[#FBD784] border border-white/15 shadow-md"
                      : "hover:bg-[#0B1D26]/60 border border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={conv.otherUser?.profilePhoto}
                      name={conv.otherUser?.name || "Student"}
                      size="md"
                    />
                    {isOnline(otherId) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0D202A]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          isActive || unread > 0
                            ? "font-bold text-white font-heading"
                            : "font-semibold text-slate-200 font-heading"
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
                          unread > 0 ? "font-semibold text-[#FBD784]" : "text-slate-400"
                        }`}
                      >
                        {lastMsg?.content || "Start conversation…"}
                      </p>
                      {unread > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FBD784] text-[#0B1D26] text-[9px] font-bold min-w-[16px] text-center shrink-0 shadow-xs">
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
          2. MIDDLE PANEL: ACTIVE CHAT STREAM
      ====================================================== */}
      {!activeUserId ? (
        <main className="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-[#0B1D26] text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#0D202A] border border-white/15 text-[#FBD784] flex items-center justify-center mx-auto mb-4 shadow-xl">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">
            Select a Peer Conversation
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Message in real-time with classmates, project teammates, and mentors across campus.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D202A] border border-white/15 text-xs font-bold text-[#FBD784] mt-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, synchronized campus messaging</span>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col min-w-0 bg-[#0B1D26]">
          {/* Active Chat Header */}
          <header className="h-16 px-4 sm:px-6 bg-[#0D202A] border-b border-white/10 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={closeChat}
                className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0D202A]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading font-bold text-sm text-white truncate">
                      {activeUser.name}
                    </h2>
                    <p className="text-[11px] truncate flex items-center gap-1.5">
                      {isTyping ? (
                        <span className="font-bold text-[#FBD784] animate-pulse">
                          typing a message…
                        </span>
                      ) : isOnline(activeUserId) ? (
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active now</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {activeUser.branch || "Campus Student"}
                          {activeUser.collegeName ? ` • ${activeUser.collegeName}` : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
                  <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-xl transition-colors border ${
                  showInfo
                    ? "bg-[#FBD784] text-[#0B1D26] border-[#FBD784]"
                    : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10"
                }`}
                title="Toggle Student Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-400">
                  <div className="w-6 h-6 border-2 border-[#FBD784] border-t-transparent rounded-full animate-spin" />
                  <span>Loading messages…</span>
                </div>
              </div>
            ) : currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                {activeUser && (
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-br from-[#FBD784] to-amber-500 mx-auto shadow-xl">
                      <img
                        src={
                          activeUser.profilePhoto ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            activeUser.name || "Student"
                          )}&background=0B1D26&color=FBD784&bold=true`
                        }
                        alt={activeUser.name}
                        className="w-full h-full object-cover rounded-[22px]"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-white">
                        {activeUser.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {activeUser.branch || "Student"} • {activeUser.collegeName || "EduBridge Member"}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0D202A] p-4 rounded-2xl border border-white/15">
                      Start collaborating on projects, textbook exchanges, or semester exam study groups!
                    </p>

                    {/* Quick Starter Chips */}
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {[
                        "Hi! 👋 Let's connect on EduBridge",
                        "Are you available for project work? 🚀",
                        "Checking about your textbook listing 📚",
                        "Can we schedule a 1-on-1 session? 💡",
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => {
                            setInput(chip);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-semibold text-[#FBD784] hover:text-white transition-all text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {/* Date Divider */}
                <div className="flex justify-center my-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {currentMessages.map((msg, idx) => {
                  const isMine = msg.sender?._id === user._id || msg.sender === user._id;

                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex items-end gap-2.5 group ${
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
                        className={`flex flex-col max-w-[80%] sm:max-w-[65%] ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? "bg-gradient-to-r from-[#FBD784] to-[#f4d077] text-[#0B1D26] font-medium rounded-2xl rounded-tr-xs shadow-md"
                              : "bg-[#0D202A] border border-white/15 text-slate-100 rounded-2xl rounded-tl-xs shadow-md"
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
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated Audio Note Preview (From reference screenshot) */}
                <div className="flex items-end gap-2.5 justify-start">
                  <Avatar
                    src={activeUser?.profilePhoto}
                    name={activeUser?.name}
                    size="sm"
                    className="shrink-0 mb-1"
                  />
                  <div className="flex flex-col items-start">
                    <AudioMessageBubble
                      duration="0:56"
                      isMine={false}
                      time="10:15 pm"
                    />
                  </div>
                </div>

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar
                      src={activeUser?.profilePhoto}
                      name={activeUser?.name}
                      size="sm"
                      className="shrink-0 mb-1"
                    />
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-[#0D202A] border border-white/15 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FBD784] animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#FBD784] animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#FBD784] animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Composer Bottom Bar */}
          <div className="p-3 sm:p-4 bg-[#0D202A] border-t border-white/10 shrink-0">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1 flex items-center rounded-2xl bg-[#0B1D26] border border-white/15 focus-within:border-[#FBD784] focus-within:ring-2 focus-within:ring-[#FBD784]/20 transition-all px-3 py-1">
                {/* Attachment / Paperclip button */}
                <button
                  type="button"
                  onClick={() => alert("Attach files: Select images, PDFs or project code references")}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  title="Attach academic material or screenshot"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  placeholder="Write a message to collaborate…"
                  className="w-full h-10 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
                />

                {input.trim() && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="p-1 mr-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Emoji / Smile button */}
                <button
                  type="button"
                  onClick={() => setInput((prev) => prev + " 👋")}
                  className="p-1.5 text-slate-400 hover:text-[#FBD784] transition-colors"
                  title="Add greeting emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className={`h-12 px-5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all ${
                  input.trim()
                    ? "bg-[#FBD784] text-[#0B1D26] hover:bg-[#ffe39d] hover:shadow-lg"
                    : "bg-white/10 text-slate-500 cursor-not-allowed border border-white/10"
                }`}
                title="Send Message"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      )}

      {/* =====================================================
          3. RIGHT PANEL: PEER PROFILE & COLLABORATION CONTEXT
          (Directly inspired by the 3rd column in reference UI!)
      ====================================================== */}
      {showInfo && activeUser && (
        <aside className="w-80 lg:w-84 border-l border-white/10 bg-[#0D202A] flex flex-col shrink-0 overflow-y-auto p-5 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Student Profile
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X size={15} />
            </button>
          </div>

          {/* Big Profile Avatar & Details */}
          <div className="text-center pb-5 border-b border-white/10">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <div className="w-full h-full rounded-3xl p-1 bg-gradient-to-br from-[#FBD784] to-amber-500 shadow-xl">
                <img
                  src={
                    activeUser.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeUser.name || "Student"
                    )}&background=0B1D26&color=FBD784&bold=true`
                  }
                  alt={activeUser.name}
                  className="w-full h-full object-cover rounded-[20px]"
                />
              </div>
              {isOnline(activeUserId) && (
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0D202A]" />
              )}
            </div>

            <h3 className="font-heading font-extrabold text-base text-white">
              {activeUser.name}
            </h3>
            <p className="text-xs text-[#FBD784] font-semibold mt-0.5">
              {activeUser.branch || "Computer Science"} • Sem {activeUser.semester || "6"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate px-2">
              {activeUser.collegeName || "Campus Colleague"}
            </p>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/15 px-3 py-1 text-[11px] font-semibold text-slate-300 mt-3">
              <Star size={12} className="text-[#FBD784] fill-[#FBD784]" />
              <span>4.9 Peer Rating</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>

          {/* Quick Action Link to Profile */}
          <div className="py-4 border-b border-white/10">
            <Link
              to={`/profile/${activeUser._id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center justify-between transition-colors group"
            >
              <span>View Full Campus Dossier</span>
              <ExternalLink size={13} className="text-[#FBD784] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Shared Academic Activity / Files (From reference screenshot) */}
          <div className="pt-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                Shared & Mutual Activity
              </h4>
              <span className="text-[11px] text-[#FBD784] cursor-pointer hover:underline">
                See all
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: "DSA Final Exam PYQ Solutions",
                  desc: "Semester 6 Notes • PDF",
                  icon: FileText,
                  time: "04:15 am",
                  tag: "Academic",
                },
                {
                  title: "Campus Hackathon Team Alpha",
                  desc: "React & Node.js • Collab",
                  icon: Users,
                  time: "06:41 pm",
                  tag: "Project",
                },
                {
                  title: "DBMS Reference Guide (Edition 4)",
                  desc: "Book Exchange • Handed off",
                  icon: BookMarked,
                  time: "07:40 am",
                  tag: "Exchange",
                },
                {
                  title: "Technical Mock Interview Prep",
                  desc: "1-on-1 Mentorship session",
                  icon: Award,
                  time: "01:34 pm",
                  tag: "Mentorship",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#0B1D26] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#FBD784] group-hover:bg-[#FBD784] group-hover:text-[#0B1D26] transition-colors">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

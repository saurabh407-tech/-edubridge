

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const {
    messages,
    onlineUsers,
    typingUsers,
  } = useSelector((s) => s.chat);

  const [activeUserId, setActiveUserId] = useState(
    paramUserId || null
  );

  const [activeUser, setActiveUser] =
    useState(null);

  const [conversations, setConversations] =
    useState([]);

  const [input, setInput] = useState("");
  const [searchConv, setSearchConv] =
    useState("");

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [showInfo, setShowInfo] =
    useState(false);

  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);

  const socket = getSocket();

  /*
   * IMPORTANT:
   * Use the same separator everywhere.
   */
  const conversationId = activeUserId
    ? [user?._id, activeUserId]
        .sort()
        .join("_")
    : null;

  const currentMessages = conversationId
    ? messages[conversationId] || []
    : [];

  /* =====================================================
     FETCH CONVERSATIONS
  ===================================================== */

  useEffect(() => {
    if (!user?._id) return;

    const fetchConversations =
      async () => {
        try {
          const { data } =
            await api.get("/messages");

          const convsWithUsers =
            await Promise.all(
              (data.data || []).map(
                async (conv) => {
                  try {
                    const convId =
                      conv._id ||
                      conv.lastMessage
                        ?.conversationId;

                    if (!convId) return conv;

                    const parts =
                      convId.split("_");

                    const otherId =
                      parts.find(
                        (id) =>
                          id !== user._id
                      );

                    if (!otherId)
                      return conv;

                    const userRes =
                      await api.get(
                        `/users/${otherId}`
                      );

                    return {
                      ...conv,
                      otherUser:
                        userRes.data
                          .data,
                      otherId,
                    };
                  } catch {
                    return conv;
                  }
                }
              )
            );

          setConversations(
            convsWithUsers
          );
        } catch (err) {
          console.error(
            "Failed to fetch conversations:",
            err
          );
        }
      };

    fetchConversations();
  }, [user?._id]);

  /* =====================================================
     FETCH ACTIVE USER + MESSAGES
  ===================================================== */

  useEffect(() => {
    if (!activeUserId || !user?._id)
      return;

    const fetchUserAndMessages =
      async () => {
        setLoadingMessages(true);

        dispatch(
          resetUnreadMessages()
        );

        try {
          const userRes =
            await api.get(
              `/users/${activeUserId}`
            );

          setActiveUser(
            userRes.data.data
          );

          const msgRes =
            await api.get(
              `/messages/${activeUserId}`
            );

          const convId = [
            user._id,
            activeUserId,
          ]
            .sort()
            .join("_");

          dispatch(
            setMessages({
              conversationId: convId,
              messages:
                msgRes.data.data || [],
            })
          );
        } catch (err) {
          console.error(
            "Failed to fetch messages:",
            err
          );
        } finally {
          setLoadingMessages(false);
        }
      };

    fetchUserAndMessages();

    if (socket) {
      const convId = [
        user._id,
        activeUserId,
      ]
        .sort()
        .join("_");

      socket.emit("markRead", {
        conversationId: convId,
      });
    }
  }, [
    activeUserId,
    user?._id,
    dispatch,
  ]);

  /* =====================================================
     SCROLL TO BOTTOM
  ===================================================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentMessages]);

  /* =====================================================
     CONVERSATION CLICK
  ===================================================== */

  const handleConversationClick = (
    conv
  ) => {
    const otherId =
      conv.otherId ||
      conv.otherUser?._id;

    if (otherId) {
      setActiveUserId(otherId);

      navigate(`/chat/${otherId}`, {
        replace: true,
      });
    }
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const handleSend = (e) => {
    e.preventDefault();

    if (
      !input.trim() ||
      !activeUserId ||
      !socket
    )
      return;

    const content = input.trim();

    socket.emit("sendMessage", {
      receiverId: activeUserId,
      content,
    });

    /*
     * Optimistic message
     */
    dispatch(
      addMessage({
        _id: Date.now().toString(),
        conversationId,
        sender: {
          _id: user._id,
          name: user.name,
          profilePhoto:
            user.profilePhoto,
        },
        receiver: activeUserId,
        content,
        createdAt:
          new Date().toISOString(),
      })
    );

    setInput("");

    socket.emit("typing", {
      receiverId: activeUserId,
      isTyping: false,
    });
  };

  /* =====================================================
     TYPING
  ===================================================== */

  const handleTyping = (e) => {
    const value = e.target.value;

    setInput(value);

    if (socket && activeUserId) {
      socket.emit("typing", {
        receiverId: activeUserId,
        isTyping: true,
      });

      clearTimeout(
        typingTimerRef.current
      );

      typingTimerRef.current =
        setTimeout(() => {
          socket.emit("typing", {
            receiverId:
              activeUserId,
            isTyping: false,
          });
        }, 1000);
    }
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isOnline = (uid) =>
    onlineUsers?.includes(uid);

  const isTyping =
    activeUserId &&
    typingUsers?.[activeUserId];

  const filteredConversations =
    conversations.filter((conv) => {
      if (!searchConv) return true;

      const name =
        conv.otherUser?.name || "";

      return name
        .toLowerCase()
        .includes(
          searchConv.toLowerCase()
        );
    });

  const closeChat = () => {
    setActiveUserId(null);
    setActiveUser(null);
    navigate("/chat");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="relative flex h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-100 via-blue-100 to-violet-100 p-0 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 md:p-4 lg:p-5">

      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      {/* =================================================
          MAIN CHAT CONTAINER
      ================================================= */}

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] overflow-hidden border border-white/70 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 md:rounded-3xl">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`flex w-full flex-shrink-0 flex-col border-r border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 md:w-[350px] ${
            activeUserId
              ? "hidden md:flex"
              : "flex"
          }`}
        >

          {/* Sidebar Header */}

          <div className="border-b border-slate-200/70 px-5 py-5 dark:border-slate-800">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Messages
                  </h1>

                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-1.5 text-[9px] font-bold text-white">
                    {conversations.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Connect with your EduBridge
                  community
                </p>
              </div>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                title="More"
              >
                <MoreHorizontal
                  size={18}
                />
              </button>
            </div>

            {/* Search */}

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchConv}
                onChange={(e) =>
                  setSearchConv(
                    e.target.value
                  )
                }
                placeholder="Search messages..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100/80 pl-10 pr-9 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:border-purple-500 dark:focus:bg-slate-800"
              />

              {searchConv && (
                <button
                  onClick={() =>
                    setSearchConv("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Conversations title */}

          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Recent Chats
            </span>

            <span className="text-[10px] font-medium text-slate-400">
              {filteredConversations.length}
            </span>
          </div>

          {/* Conversation List */}

          <div className="flex-1 overflow-y-auto px-2 pb-3">

            {filteredConversations.length ===
            0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-400/10">
                  <MessageSquare
                    size={28}
                    className="text-purple-400"
                  />
                </div>

                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No conversations yet
                </h3>

                <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-400">
                  Start a conversation
                  with another student
                  to see your chats here.
                </p>
              </div>
            ) : (
              filteredConversations.map(
                (conv, idx) => {
                  const otherId =
                    conv.otherId ||
                    conv.otherUser?._id;

                  const isActive =
                    activeUserId ===
                    otherId;

                  const lastMsg =
                    conv.lastMessage;

                  const unread =
                    conv.unreadCount ||
                    0;

                  return (
                    <button
                      key={
                        conv._id || idx
                      }
                      onClick={() =>
                        handleConversationClick(
                          conv
                        )
                      }
                      className={`group mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10"
                          : "hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                      }`}
                    >

                      {/* Avatar */}

                      <div className="relative flex-shrink-0">

                        <div
                          className={`rounded-full p-[2px] ${
                            isActive
                              ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                              : "bg-transparent"
                          }`}
                        >
                          <div className="rounded-full bg-white p-[1px] dark:bg-slate-950">
                            <Avatar
                              src={
                                conv
                                  .otherUser
                                  ?.profilePhoto
                              }
                              name={
                                conv
                                  .otherUser
                                  ?.name ||
                                "U"
                              }
                              size="md"
                            />
                          </div>
                        </div>

                        {isOnline(
                          otherId
                        ) && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-950" />
                        )}
                      </div>

                      {/* Conversation info */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`truncate text-sm ${
                              unread > 0
                                ? "font-black text-slate-900 dark:text-white"
                                : "font-semibold text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {conv
                              .otherUser
                              ?.name ||
                              "Unknown User"}
                          </p>

                          {lastMsg?.createdAt && (
                            <span className="flex-shrink-0 text-[9px] text-slate-400">
                              {formatDistanceToNow(
                                new Date(
                                  lastMsg.createdAt
                                ),
                                {
                                  addSuffix:
                                    false,
                                }
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p
                            className={`truncate text-xs ${
                              unread > 0
                                ? "font-semibold text-slate-700 dark:text-slate-300"
                                : "text-slate-400"
                            }`}
                          >
                            {lastMsg?.content ||
                              "Start a conversation"}
                          </p>

                          {unread >
                            0 && (
                            <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-1.5 text-[9px] font-black text-white shadow-sm">
                              {unread >
                              99
                                ? "99+"
                                : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                }
              )
            )}
          </div>
        </aside>

        {/* =================================================
            EMPTY DESKTOP CHAT
        ================================================= */}

        {!activeUserId ? (
          <main className="hidden flex-1 items-center justify-center bg-gradient-to-br from-white/60 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-pink-950/10 md:flex">

            <div className="max-w-sm px-6 text-center">

              <div className="relative mx-auto mb-6 h-24 w-24">

                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 opacity-20 blur-xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <MessageSquare
                    size={36}
                    strokeWidth={1.5}
                    className="text-slate-400"
                  />
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-800 dark:text-white">
                Your Messages
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select a conversation from
                the left to start chatting
                with your classmates,
                mentors and teammates.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <Sparkles size={13} />
                Stay connected with EduBridge
              </div>
            </div>
          </main>
        ) : (
          /* =================================================
             CHAT AREA
          ================================================= */

          <main className="flex min-w-0 flex-1 flex-col bg-gradient-to-br from-white via-slate-50 to-purple-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-purple-950/20">

            {/* =================================================
                CHAT HEADER
            ================================================= */}

            <header className="flex h-[72px] flex-shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">

              <div className="flex min-w-0 items-center gap-3">

                {/* Mobile back */}

                <button
                  onClick={closeChat}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
                >
                  <ArrowLeft
                    size={19}
                  />
                </button>

                {activeUser ? (
                  <>
                    {/* Avatar */}

                    <div className="relative flex-shrink-0">
                      <div className="rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[2px]">
                        <div className="rounded-full bg-white p-[1px] dark:bg-slate-950">
                          <Avatar
                            src={
                              activeUser.profilePhoto
                            }
                            name={
                              activeUser.name
                            }
                            size="md"
                          />
                        </div>
                      </div>

                      {isOnline(
                        activeUserId
                      ) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-950" />
                      )}
                    </div>

                    {/* User info */}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800 dark:text-white">
                        {activeUser.name}
                      </p>

                      <p className="mt-0.5 text-[10px]">
                        {isTyping ? (
                          <span className="font-semibold text-purple-500">
                            typing...
                          </span>
                        ) : isOnline(
                            activeUserId
                          ) ? (
                          <span className="font-semibold text-green-500">
                            Active now
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            {activeUser.branch ||
                              "Student"}
                            {activeUser.collegeName
                              ? ` • ${activeUser.collegeName}`
                              : ""}
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />

                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                )}
              </div>

              {/* Header Actions */}

              <div className="flex items-center gap-1">

                <button
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-purple-500 sm:flex dark:hover:bg-slate-800"
                  title="Audio call"
                >
                  <Phone
                    size={17}
                  />
                </button>

                <button
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-purple-500 sm:flex dark:hover:bg-slate-800"
                  title="Video call"
                >
                  <Video
                    size={18}
                  />
                </button>

                <button
                  onClick={() =>
                    setShowInfo(
                      !showInfo
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    showInfo
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Chat info"
                >
                  <Info
                    size={18}
                  />
                </button>
              </div>
            </header>

            {/* =================================================
                CHAT INFO BAR
            ================================================= */}

            {showInfo &&
              activeUser && (
                <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 px-5 py-3 dark:border-purple-900/30 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-orange-950/20">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={
                        activeUser.profilePhoto
                      }
                      name={
                        activeUser.name
                      }
                      size="sm"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {activeUser.name}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {activeUser.branch ||
                          "Student"}
                        {activeUser.collegeName
                          ? ` • ${activeUser.collegeName}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* =================================================
                MESSAGES
            ================================================= */}

            <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">

              {/* Decorative glow */}

              <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-400/5 blur-3xl" />

              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />

                    <span className="text-xs text-slate-400">
                      Loading messages...
                    </span>
                  </div>
                </div>
              ) : currentMessages.length ===
                0 ? (
                /* Empty conversation */

                <div className="relative flex h-full flex-col items-center justify-center text-center">

                  {activeUser && (
                    <>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 opacity-20 blur-xl" />

                        <div className="relative rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[3px]">
                          <div className="rounded-full bg-white p-[2px] dark:bg-slate-950">
                            <Avatar
                              src={
                                activeUser.profilePhoto
                              }
                              name={
                                activeUser.name
                              }
                              size="xl"
                            />
                          </div>
                        </div>
                      </div>

                      <h2 className="text-lg font-black text-slate-800 dark:text-white">
                        {activeUser.name}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Say hello and start
                        your conversation 👋
                      </p>

                      <button
                        onClick={() =>
                          setInput(
                            "Hi! 👋"
                          )
                        }
                        className="mt-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5"
                      >
                        Say Hello
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative mx-auto flex max-w-3xl flex-col gap-2">

                  {/* Date / start divider */}

                  <div className="mb-5 flex items-center justify-center">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[9px] font-semibold text-slate-400 shadow-sm dark:bg-slate-900/80">
                      Today
                    </span>
                  </div>

                  {currentMessages.map(
                    (msg, i) => {
                      const isMine =
                        msg.sender?._id ===
                          user._id ||
                        msg.sender ===
                          user._id;

                      return (
                        <div
                          key={
                            msg._id || i
                          }
                          className={`group flex items-end gap-2 ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          {/* Other user's avatar */}

                          {!isMine && (
                            <Avatar
                              src={
                                activeUser?.profilePhoto
                              }
                              name={
                                activeUser?.name
                              }
                              size="sm"
                              className="mb-1 flex-shrink-0"
                            />
                          )}

                          {/* Bubble */}

                          <div
                            className={`relative max-w-[78%] sm:max-w-[65%] ${
                              isMine
                                ? "items-end"
                                : "items-start"
                            } flex flex-col`}
                          >
                            <div
                              className={`px-4 py-2.5 text-sm leading-5 shadow-sm ${
                                isMine
                                  ? "rounded-[22px] rounded-br-[6px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-pink-500/10"
                                  : "rounded-[22px] rounded-bl-[6px] border border-slate-200/70 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              }`}
                            >
                              <p className="break-words whitespace-pre-wrap">
                                {
                                  msg.content
                                }
                              </p>
                            </div>

                            {/* Message time */}

                            <div
                              className={`mt-1 flex items-center gap-1 px-1 text-[9px] text-slate-400 ${
                                isMine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {msg.createdAt
                                ? formatDistanceToNow(
                                    new Date(
                                      msg.createdAt
                                    ),
                                    {
                                      addSuffix:
                                        true,
                                    }
                                  )
                                : ""}

                              {isMine && (
                                <CheckCheck
                                  size={11}
                                  className="text-purple-400"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* Typing */}

                  {isTyping && (
                    <div className="mt-1 flex items-end gap-2">
                      <Avatar
                        src={
                          activeUser?.profilePhoto
                        }
                        name={
                          activeUser?.name
                        }
                        size="sm"
                      />

                      <div className="rounded-[20px] rounded-bl-[5px] border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                          <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                            style={{
                              animationDelay:
                                "150ms",
                            }}
                          />

                          <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                            style={{
                              animationDelay:
                                "300ms",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* =================================================
                MESSAGE COMPOSER
            ================================================= */}

            <div className="border-t border-slate-200/70 bg-white/90 px-3 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:px-5">

              <form
                onSubmit={handleSend}
                className="mx-auto flex max-w-3xl items-end gap-2"
              >

                {/* Left action */}

                <button
                  type="button"
                  className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-400/10 text-purple-500 transition hover:scale-105 sm:flex"
                  title="Add image"
                >
                  <ImageIcon
                    size={18}
                  />
                </button>

                {/* Input */}

                <div className="relative flex min-h-11 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-100/80 transition focus-within:border-purple-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-purple-500 dark:focus-within:bg-slate-800">

                  <input
                    className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                    placeholder="Message..."
                    value={input}
                    onChange={
                      handleTyping
                    }
                  />

                  {!input.trim() && (
                    <button
                      type="button"
                      className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-purple-500 dark:hover:bg-slate-700"
                      title="Emoji"
                    >
                      <Smile
                        size={19}
                      />
                    </button>
                  )}

                  {input.trim() && (
                    <button
                      type="button"
                      onClick={() =>
                        setInput("")
                      }
                      className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300 dark:bg-slate-700"
                    >
                      <X
                        size={13}
                      />
                    </button>
                  )}
                </div>

                {/* Mic when empty */}

                {!input.trim() && (
                  <button
                    type="button"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-purple-500 dark:hover:bg-slate-800"
                    title="Voice message"
                  >
                    <Mic size={18} />
                  </button>
                )}

                {/* Send */}

                {input.trim() && (
                  <button
                    type="submit"
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/20 transition hover:scale-105 active:scale-95"
                  >
                    <Send
                      size={17}
                      className="ml-0.5"
                    />
                  </button>
                )}
              </form>

              <p className="mx-auto mt-2 hidden max-w-3xl text-center text-[9px] text-slate-400 sm:block">
                Press Enter to send • Your
                messages are delivered in
                real-time
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}


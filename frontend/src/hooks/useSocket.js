import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../services/socket";
import { addMessage, addOnlineUser, removeOnlineUser, setTyping, incrementUnreadMessages } from "../store/slices/chatSlice";
import { addNotification } from "../store/slices/notificationSlice";
import toast from "react-hot-toast";

export const useSocket = (token) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (!token) return;

    const socket = initSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    // New message received
    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));

      // Increment unread count
      dispatch(incrementUnreadMessages());

      // Toast notification
      toast(`💬 ${message.sender?.name || "Someone"}: ${message.content?.slice(0, 40) || ""}`, {
        duration: 3000,
      });
    });

    // Real-time notification (project request, accept, reject, mentorship etc)
    socket.on("notification", (notif) => {
      dispatch(addNotification({
        ...notif,
        _id: notif._id || Date.now().toString(),
        isRead: false,
        createdAt: notif.createdAt || new Date().toISOString(),
      }));

      const icons = {
        project_request: "👥",
        project_accepted: "✅",
        project_rejected: "❌",
        mentorship_booked: "📅",
        mentorship_confirmed: "✅",
        message: "💬",
        book_reserved: "📚",
        resource_upload: "📤",
        system: "🔔",
      };

      const icon = icons[notif.type] || "🔔";
      toast(`${icon} ${notif.title}`, { duration: 4000 });
    });

    socket.on("userOnline", ({ userId }) => dispatch(addOnlineUser(userId)));
    socket.on("userOffline", ({ userId }) => dispatch(removeOnlineUser(userId)));
    socket.on("userTyping", ({ userId, isTyping }) => dispatch(setTyping({ userId, isTyping })));
    socket.on("error", (err) => console.error("Socket error:", err));

    return () => disconnectSocket();
  }, [token, dispatch]);

  return socketRef.current;
};
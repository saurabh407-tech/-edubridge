const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const onlineUsers = new Map(); // userId -> socketId

exports.initSocket = (io) => {
  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Token invalid"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    socket.join(userId); // Personal room

    console.log(`User ${userId} connected`);

    // Update last active
    User.findByIdAndUpdate(userId, { lastActive: new Date() }).exec();

    // Broadcast online status
    socket.broadcast.emit("userOnline", { userId });

    // Send message
    socket.on("sendMessage", async ({ receiverId, content, type = "text", fileUrl }) => {
      try {
        const conversationId = [userId, receiverId].sort().join("_");
        const message = await Message.create({
          conversationId,
          sender: userId,
          receiver: receiverId,
          content,
          type,
          fileUrl,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name profilePhoto");

        // Receiver ke room mein bhejo
        io.to(receiverId).emit("newMessage", populatedMessage);

        // Sender ko confirmation
        socket.emit("messageSent", populatedMessage);
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // Send notification to specific user
    socket.on("sendNotification", ({ recipientId, notification }) => {
      io.to(recipientId).emit("notification", notification);
    });

    // Typing indicator
    socket.on("typing", ({ receiverId, isTyping }) => {
      io.to(receiverId).emit("userTyping", { userId, isTyping });
    });

    // Mark messages as read
    socket.on("markRead", async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversationId, receiver: userId, isRead: false },
          { isRead: true, readAt: new Date() }
        );
      } catch (err) {
        console.error("Mark read error:", err.message);
      }
    });

    // Join room (project/mentorship room ke liye)
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("userOffline", { userId });
      console.log(`User ${userId} disconnected`);
    });
  });
};

exports.getOnlineUsers = () => Array.from(onlineUsers.keys());

// Kisi specific user ko notification bhejo
exports.sendNotificationToUser = (io, userId, notification) => {
  io.to(userId.toString()).emit("notification", notification);
};
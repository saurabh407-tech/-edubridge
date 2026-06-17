const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createNotification = async ({ recipient, sender, type, title, message, link, io }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
    });

    const populated = await Notification.findById(notification._id)
      .populate("sender", "name profilePhoto");

    // Socket.io se real-time notification bhejo
    if (io) {
      io.to(recipient.toString()).emit("notification", {
        _id: populated._id,
        type: populated.type,
        title: populated.title,
        message: populated.message,
        link: populated.link,
        sender: populated.sender,
        isRead: false,
        createdAt: populated.createdAt,
      });
    }

    // Firebase FCM (optional)
    try {
      const admin = require("../config/firebase");
      if (admin.apps && admin.apps.length > 0) {
        const user = await User.findById(recipient).select("fcmToken");
        if (user?.fcmToken) {
          await admin.messaging().send({
            token: user.fcmToken,
            notification: { title, body: message },
            data: { link: link || "", type },
          });
        }
      }
    } catch (fcmErr) {
      console.warn("FCM skipped:", fcmErr.message);
    }

    return populated;
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

exports.getNotifications = async (userId, page = 1, limit = 20) => {
  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "name profilePhoto")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return { notifications, unreadCount };
};

exports.markAsRead = async (notificationId, userId) => {
  await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() }
  );
};

exports.markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};
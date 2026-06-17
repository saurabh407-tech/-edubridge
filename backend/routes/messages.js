const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Message = require("../models/Message");

// Get conversation history
router.get("/:userId", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const conversationId = [req.user._id.toString(), req.params.userId].sort().join("_");

    const messages = await Message.find({ conversationId })
      .populate("sender", "name profilePhoto")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mark as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages.reverse() });
  } catch (err) { next(err); }
});

// Get conversations list
router.get("/", protect, async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$receiver", req.user._id] }, { $eq: ["$isRead", false] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);
    res.json({ success: true, data: conversations });
  } catch (err) { next(err); }
});

module.exports = router;

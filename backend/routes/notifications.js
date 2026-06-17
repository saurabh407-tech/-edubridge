const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getNotifications, markAsRead, markAllAsRead } = require("../services/notificationService");

router.get("/", protect, async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const data = await getNotifications(req.user._id, page);
    res.json({ success: true, ...data });
  } catch (err) { next(err); }
});

router.put("/:id/read", protect, async (req, res, next) => {
  try {
    await markAsRead(req.params.id, req.user._id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.put("/read-all", protect, async (req, res, next) => {
  try {
    await markAllAsRead(req.user._id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;

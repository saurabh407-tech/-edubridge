// =================== routes/users.js ===================
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadProfile, uploadResume } = require("../middleware/upload");
const User = require("../models/User");

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("universityId", "name").select("-password -otp -otpExpiry");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.put("/profile", protect, async (req, res, next) => {
  try {
    const allowedFields = ["name", "phone", "bio", "skills", "interestAreas",
      "linkedIn", "github", "branch", "semester", "graduationYear"];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.post("/profile/photo", protect, uploadProfile.single("photo"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: req.file.path }, { new: true });
    res.json({ success: true, profilePhoto: user.profilePhoto });
  } catch (err) { next(err); }
});

router.post("/resume", protect, uploadResume.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const user = await User.findByIdAndUpdate(req.user._id, { resumeUrl: req.file.path }, { new: true });
    res.json({ success: true, resumeUrl: user.resumeUrl });
  } catch (err) { next(err); }
});

router.put("/fcm-token", protect, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { fcmToken: req.body.token });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;

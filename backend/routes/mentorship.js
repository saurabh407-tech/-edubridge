const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Mentorship = require("../models/Mentorship");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

// Get all mentorship listings
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { topic: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const total = await Mentorship.countDocuments(query);
    const mentorships = await Mentorship.find(query)
      .populate("mentor", "name profilePhoto branch skills mentorshipRating contributionScore")
      .sort({ averageRating: -1, createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: mentorships,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

// Get single mentorship
router.get("/:id", async (req, res, next) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate("mentor", "name profilePhoto branch skills");
    if (!mentorship) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: mentorship });
  } catch (err) { next(err); }
});

// Create mentorship slot
router.post("/", protect, async (req, res, next) => {
  try {
    const mentorship = await Mentorship.create({ ...req.body, mentor: req.user._id });
    await mentorship.populate("mentor", "name profilePhoto");
    res.status(201).json({ success: true, data: mentorship });
  } catch (err) { next(err); }
});

// Book a slot
router.post("/:id/book", protect, async (req, res, next) => {
  try {
    const { slotId, studentNote } = req.body;
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({ success: false, message: "Mentorship not found" });
    }

    // Apna khud ka mentorship book nahi kar sakte
    if (mentorship.mentor.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot book your own mentorship session" });
    }

    // Slot dhundo — string comparison ke saath
    const slotIndex = mentorship.availableSlots.findIndex(
      s => s._id.toString() === slotId.toString()
    );

    if (slotIndex === -1) {
      return res.status(400).json({ success: false, message: "Slot not found" });
    }

    if (mentorship.availableSlots[slotIndex].isBooked) {
      return res.status(400).json({ success: false, message: "This slot is already booked" });
    }

    // Check if already booked by this user
    const alreadyBooked = mentorship.bookings.some(
      b => b.student.toString() === req.user._id.toString()
    );
    if (alreadyBooked) {
      return res.status(400).json({ success: false, message: "You have already booked this session" });
    }

    // Slot book karo
    mentorship.availableSlots[slotIndex].isBooked = true;
    mentorship.availableSlots[slotIndex].bookedBy = req.user._id;

    // Booking add karo
    mentorship.bookings.push({
      student: req.user._id,
      slotId: mentorship.availableSlots[slotIndex]._id,
      studentNote: studentNote || "",
      status: "confirmed",
    });

    await mentorship.save();

    // Notification bhejo mentor ko
    try {
      await createNotification({
        recipient: mentorship.mentor,
        sender: req.user._id,
        type: "mentorship_booked",
        title: "New Mentorship Booking",
        message: `${req.user.name} booked a slot for "${mentorship.topic}"`,
        link: `/mentorship/${mentorship._id}`,
      });
    } catch (notifErr) {
      console.warn("Notification failed:", notifErr.message);
    }

    res.json({ success: true, message: "Slot booked successfully!" });
  } catch (err) { next(err); }
});

// Rate mentorship session
router.post("/:id/rate", protect, async (req, res, next) => {
  try {
    const { bookingId, rating, review } = req.body;
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) return res.status(404).json({ success: false, message: "Not found" });

    const booking = mentorship.bookings.id(bookingId);
    if (!booking || booking.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    booking.rating = rating;
    booking.review = review;
    booking.status = "completed";

    const validRatings = mentorship.bookings.filter(b => b.rating);
    mentorship.averageRating = validRatings.reduce((a, b) => a + b.rating, 0) / validRatings.length;
    mentorship.totalSessions = mentorship.bookings.filter(b => b.status === "completed").length;

    await mentorship.save();

    // Mentor rating update karo
    try {
      const allMentorships = await Mentorship.find({ mentor: mentorship.mentor });
      const allRatings = allMentorships.flatMap(m => m.bookings.filter(b => b.rating).map(b => b.rating));
      if (allRatings.length > 0) {
        await User.findByIdAndUpdate(mentorship.mentor, {
          mentorshipRating: allRatings.reduce((a, b) => a + b, 0) / allRatings.length,
          mentorshipRatingCount: allRatings.length,
        });
      }
    } catch (ratingErr) {
      console.warn("Rating update failed:", ratingErr.message);
    }

    res.json({ success: true, averageRating: mentorship.averageRating });
  } catch (err) { next(err); }
});

module.exports = router;
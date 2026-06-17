const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    description: { type: String },

    category: {
      type: String,
      enum: ["dsa", "resume_review", "internship_guidance", "mock_interview", "project_help", "career_guidance", "other"],
    },

    availableSlots: [
      {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    meetingMode: { type: String, enum: ["online", "offline", "both"], default: "online" },
    meetingLink: { type: String },
    capacity: { type: Number, default: 1 },

    bookings: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        slotId: { type: mongoose.Schema.Types.ObjectId },
        status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
        studentNote: { type: String },
        mentorNote: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        bookedAt: { type: Date, default: Date.now },
      },
    ],

    averageRating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

mentorshipSchema.index({ mentor: 1, topic: 1 });
mentorshipSchema.index({ topic: "text", description: "text" });

module.exports = mongoose.model("Mentorship", mentorshipSchema);

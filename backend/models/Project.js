const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["web", "mobile", "ai_ml", "blockchain", "iot", "data_science", "other"] },

    rolesNeeded: [
      {
        role: { type: String, required: true },
        skills: [{ type: String }],
        count: { type: Number, default: 1 },
        filled: { type: Number, default: 0 },
      },
    ],

    requiredSkills: [{ type: String }],
    expectedCommitment: { type: String }, // e.g. "10 hrs/week"
    deadline: { type: Date },
    duration: { type: String }, // e.g. "3 months"

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    joinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String },
        message: { type: String },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    maxMembers: { type: Number, default: 5 },
    status: { type: String, enum: ["open", "in_progress", "completed", "cancelled"], default: "open" },

    githubRepo: { type: String },
    projectUrl: { type: String },
    tags: [{ type: String }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", description: "text", requiredSkills: "text" });
projectSchema.index({ status: 1, creator: 1 });

module.exports = mongoose.model("Project", projectSchema);

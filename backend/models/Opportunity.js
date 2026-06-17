const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["hackathon", "internship", "competition", "scholarship", "workshop", "placement_drive"],
      required: true,
    },

    organizer: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    location: { type: String },
    isRemote: { type: Boolean, default: false },
    state: { type: String },

    eligibleBranches: [{ type: String }],
    eligibleSemesters: [{ type: Number }],
    skills: [{ type: String }],

    registrationLink: { type: String },
    deadline: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },

    prize: { type: String },
    stipend: { type: String },

    imageUrl: { type: String },
    tags: [{ type: String }],

    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },

    views: { type: Number, default: 0 },

    // Track who applied
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

opportunitySchema.index({ title: "text", description: "text", skills: "text" });
opportunitySchema.index({ type: 1, deadline: 1 });
opportunitySchema.index({ state: 1, eligibleBranches: 1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);
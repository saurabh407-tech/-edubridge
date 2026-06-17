const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx", "ppt", "image", "zip", "other"] },
    fileSize: { type: Number },
    publicId: { type: String }, // Cloudinary public ID

    category: {
      type: String,
      enum: ["notes", "pyq", "assignments", "lab_manuals", "placement", "interview_questions", "projects", "research_papers"],
      required: true,
    },

    // Metadata
    subject: { type: String, required: true },
    semester: { type: Number, min: 1, max: 8 },
    branch: { type: String },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    tags: [{ type: String }],

    // Stats
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: { type: Number, min: 1, max: 5 } }],
    averageRating: { type: Number, default: 0 },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDuplicate: { type: Boolean, default: false },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    contentHash: { type: String, default: undefined },

    isApproved: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", subject: "text", tags: "text", description: "text" });
resourceSchema.index({ semester: 1, branch: 1, category: 1 });
resourceSchema.index({ universityId: 1, collegeId: 1 });
resourceSchema.index({ downloadCount: -1 });

module.exports = mongoose.model("Resource", resourceSchema);

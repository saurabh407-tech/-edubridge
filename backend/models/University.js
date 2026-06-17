const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    shortName: { type: String },
    state: { type: String, required: true },
    website: { type: String },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

universitySchema.index({ name: "text" });

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    state: { type: String, required: true },
    city: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    isApproved: { type: Boolean, default: false },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

collegeSchema.index({ name: "text", city: "text" });
collegeSchema.index({ universityId: 1 });

const University = mongoose.model("University", universitySchema);
const College = mongoose.model("College", collegeSchema);

module.exports = { University, College };

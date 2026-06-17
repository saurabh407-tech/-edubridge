const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, select: false },
    googleId: { type: String },

    role: {
      type: String,
      enum: ["student", "senior_mentor", "college_admin", "university_admin", "super_admin"],
      default: "student",
    },

    // Academic info
    collegeName: { type: String },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    state: { type: String },
    branch: { type: String },
    semester: { type: Number, min: 1, max: 8 },
    graduationYear: { type: Number },

    // Profile
    profilePhoto: { type: String, default: "" },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    interestAreas: [{ type: String }],
    linkedIn: { type: String },
    github: { type: String },
    resumeUrl: { type: String },

    // Stats
    contributionScore: { type: Number, default: 0 },
    uploadedResourcesCount: { type: Number, default: 0 },
    mentorshipRating: { type: Number, default: 0 },
    mentorshipRatingCount: { type: Number, default: 0 },
    hackathonParticipation: { type: Number, default: 0 },
    achievements: [{ title: String, description: String, date: Date }],

    // Auth
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    fcmToken: { type: String },

    isActive: { type: Boolean, default: true },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

// Text search index
userSchema.index({ name: "text", skills: "text", branch: "text" });

module.exports = mongoose.model("User", userSchema);

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");

// ── Helper: Generate JWT ──
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// ── Helper: User response ──
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  role: user.role,
  branch: user.branch,
  semester: user.semester,
  collegeName: user.collegeName,
  isVerified: user.isVerified,
  skills: user.skills,
  contributionScore: user.contributionScore,
  mentorshipRating: user.mentorshipRating,
  uploadedResourcesCount: user.uploadedResourcesCount,
  linkedIn: user.linkedIn,
  github: user.github,
  bio: user.bio,
});

// ── Register ──
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, universityId, collegeName, state, branch, semester, graduationYear, skills, interestAreas, linkedIn, github, bio } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered. Please login." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name, email, password, phone,
      universityId, collegeName, state,
      branch, semester, graduationYear,
      skills: Array.isArray(skills) ? skills : [],
      interestAreas: Array.isArray(interestAreas) ? interestAreas : [],
      linkedIn, github, bio,
      otp, otpExpiry,
      isVerified: false,
      isActive: true,
    });

    // Send OTP email (non-blocking)
    try {
      await sendEmail({
        to: email,
        subject: "EduBridge - Verify Your Email",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="color:#6366f1;">Welcome to EduBridge! 🎓</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your OTP for email verification is:</p>
            <div style="background:#f3f4f6;padding:20px;border-radius:8px;text-align:center;margin:20px 0;">
              <span style="font-size:36px;font-weight:bold;color:#6366f1;letter-spacing:8px;">${otp}</span>
            </div>
            <p style="color:#6b7280;font-size:14px;">This OTP expires in <strong>10 minutes</strong>.</p>
            <p style="color:#6b7280;font-size:12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("Email send failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      userId: user._id,
      message: "OTP sent to your email. Please verify.",
      // devOtp REMOVED — OTP only via email
    });
  } catch (err) { next(err); }
};

// ── Verify OTP ──
exports.verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId).select("+otp +otpExpiry");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified) {
      const token = generateToken(user._id);
      return res.json({ success: true, token, user: userResponse(user) });
    }

    // Debug log — terminal mein check karo
    console.log("DB OTP:", user.otp, "| Entered OTP:", otp, "| Expiry:", user.otpExpiry);

    if (!user.otp) {
      return res.status(400).json({ success: false, message: "OTP not found. Please register again." });
    }

    // String comparison dono taraf
    if (user.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please check your email." });
    }

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please register again." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, user: userResponse(user) });
  } catch (err) { next(err); }
};

// ── Login ──
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: "Please verify your email first" });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Account deactivated. Contact support." });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: userResponse(user) });
  } catch (err) { next(err); }
};

// ── Google Login ── FIXED
exports.googleLogin = async (req, res, next) => {
  try {
    const { credential, userInfo } = req.body;

    // userInfo already fetched by frontend
    if (!userInfo || !userInfo.email) {
      return res.status(400).json({ success: false, message: "Google user info missing" });
    }

    const { email, name, picture, sub: googleId } = userInfo;

    let user = await User.findOne({ email });

    if (user) {
      // Existing user — update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.profilePhoto) user.profilePhoto = picture;
        await user.save();
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, message: "Account deactivated" });
      }
    } else {
      // New user via Google — create account
      user = await User.create({
        name,
        email,
        googleId,
        profilePhoto: picture,
        isVerified: true,
        isActive: true,
        password: await bcrypt.hash(crypto.randomBytes(20).toString("hex"), 10),
        role: "student",
        collegeName: "Not specified",
        branch: "Not specified",
        semester: 1,
        skills: [],
      });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: userResponse(user) });
  } catch (err) { next(err); }
};

// ── Forgot Password ──
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: "If this email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: email,
        subject: "EduBridge - Password Reset",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;">
            <h2 style="color:#6366f1;">Reset Your Password</h2>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">Reset Password</a>
            <p style="color:#6b7280;font-size:12px;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("Reset email failed:", emailErr.message);
    }

    res.json({ success: true, message: "Password reset link sent to your email." });
  } catch (err) { next(err); }
};

// ── Reset Password ──
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. Please login." });
  } catch (err) { next(err); }
};

// ── Get Me ──
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: userResponse(user) });
  } catch (err) { next(err); }
};
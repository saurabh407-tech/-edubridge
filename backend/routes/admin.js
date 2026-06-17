const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Resource = require("../models/Resource");
const { College } = require("../models/University");
const Opportunity = require("../models/Opportunity");

// All admin routes require auth
router.use(protect);

// Dashboard stats (college_admin+)
router.get("/stats", authorize("college_admin", "university_admin", "super_admin"), async (req, res, next) => {
  try {
    const [totalUsers, totalResources, totalDownloads] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Resource.countDocuments({ isActive: true }),
      Resource.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),
    ]);

    const topResources = await Resource.find({ isActive: true })
      .sort({ downloadCount: -1 }).limit(5)
      .populate("uploadedBy", "name").select("title downloadCount category");

    const topContributors = await User.find({ isActive: true })
      .sort({ contributionScore: -1 }).limit(5)
      .select("name profilePhoto contributionScore uploadedResourcesCount");

    res.json({
      success: true,
      data: {
        totalUsers,
        totalResources,
        totalDownloads: totalDownloads[0]?.total || 0,
        topResources,
        topContributors,
      },
    });
  } catch (err) { next(err); }
});

// Manage users (super_admin)
router.get("/users", authorize("super_admin", "university_admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$text = { $search: search };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

// Approve college requests
router.put("/colleges/:id/approve", authorize("university_admin", "super_admin"), async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!college) return res.status(404).json({ success: false, message: "College not found" });
    res.json({ success: true, data: college });
  } catch (err) { next(err); }
});

// Pending college requests
router.get("/colleges/pending", authorize("university_admin", "super_admin"), async (req, res, next) => {
  try {
    const colleges = await College.find({ isApproved: false })
      .populate("requestedBy", "name email").populate("universityId", "name");
    res.json({ success: true, data: colleges });
  } catch (err) { next(err); }
});

// Change user role
router.put("/users/:id/role", authorize("super_admin"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

module.exports = router;

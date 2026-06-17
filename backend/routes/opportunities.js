const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Opportunity = require("../models/Opportunity");
const { createNotification } = require("../services/notificationService");

// GET all opportunities
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 12, type, state, branch, search } = req.query;
    const query = { isActive: true, isApproved: true };
    if (type) query.type = type;
    if (state) query.state = state;
    if (branch) query.eligibleBranches = { $in: [branch, "All", "all"] };
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { organizer: new RegExp(search, "i") },
      ];
    }
    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .populate("postedBy", "name profilePhoto")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, data: opportunities, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { next(err); }
});

// POST create opportunity
router.post("/", protect, async (req, res, next) => {
  try {
    const opp = await Opportunity.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, data: opp });
  } catch (err) { next(err); }
});

// GET single opportunity — with applicants populated
router.get("/:id", async (req, res, next) => {
  try {
    const opp = await Opportunity.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    )
      .populate("postedBy", "name profilePhoto")
      .populate("applicants.user", "name profilePhoto branch collegeName");
    if (!opp) return res.status(404).json({ success: false, message: "Opportunity not found" });
    res.json({ success: true, data: opp });
  } catch (err) { next(err); }
});

// POST track apply — notification with correct title
router.post("/:id/apply", protect, async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate("postedBy", "name _id");
    if (!opp) return res.status(404).json({ success: false, message: "Opportunity not found" });

    const alreadyApplied = opp.applicants?.some(
      a => a.user.toString() === req.user._id.toString()
    );

    if (!alreadyApplied) {
      if (!opp.applicants) opp.applicants = [];
      opp.applicants.push({ user: req.user._id, appliedAt: new Date() });
      await opp.save();

      // Poster ko notification — opportunity ka actual title use karo
      if (opp.postedBy && opp.postedBy._id.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: opp.postedBy._id,
          sender: req.user._id,
          type: "system",
          title: "New Application Received! 🎉",
          message: `${req.user.name} has applied for "${opp.title}"`,
          link: `/opportunities/${opp._id}`,
          io: req.io,
        });
      }
    }

    res.json({
      success: true,
      registrationLink: opp.registrationLink,
      alreadyApplied,
      message: alreadyApplied ? "Already applied" : "Application tracked!",
    });
  } catch (err) { next(err); }
});

module.exports = router;
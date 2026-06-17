const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createProject, getProjects, getTeamSuggestions, sendJoinRequest, respondToRequest } = require("../controllers/projectController");
const Project = require("../models/Project");

router.route("/").get(getProjects).post(protect, createProject);

router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("creator", "name profilePhoto branch skills")
      .populate("members.user", "name profilePhoto skills")
      .populate("joinRequests.user", "name profilePhoto skills branch");
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

router.get("/:id/suggestions", protect, getTeamSuggestions);
router.post("/:id/request", protect, sendJoinRequest);
router.put("/:id/request/:requestId", protect, respondToRequest);

router.put("/:id", protect, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

module.exports = router;

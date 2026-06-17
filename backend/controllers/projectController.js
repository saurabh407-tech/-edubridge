const Project = require("../models/Project");
const User = require("../models/User");
const { findTeamMatches } = require("../services/aiService");
const { createNotification } = require("../services/notificationService");

// @desc  Create project
// @route POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, creator: req.user._id });
    await project.populate("creator", "name profilePhoto branch");
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

// @desc  Get projects
// @route GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "open", skills, search } = req.query;
    const query = { isActive: true, status };
    if (skills) query.requiredSkills = { $in: skills.split(",") };
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("creator", "name profilePhoto branch skills")
      .populate("members.user", "name profilePhoto")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
};

// @desc  Get AI team suggestions
// @route GET /api/projects/:id/suggestions
exports.getTeamSuggestions = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    const suggestions = await findTeamMatches(project);
    res.json({ success: true, data: suggestions });
  } catch (err) { next(err); }
};

// @desc  Send join request
// @route POST /api/projects/:id/request
exports.sendJoinRequest = async (req, res, next) => {
  try {
    const { role, message } = req.body;
    const project = await Project.findById(req.params.id)
      .populate("creator", "name profilePhoto");

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.status !== "open") return res.status(400).json({ success: false, message: "Project is not open" });

    const alreadyRequested = project.joinRequests.some(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyRequested) return res.status(400).json({ success: false, message: "Already requested" });

    const isMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    );
    if (isMember) return res.status(400).json({ success: false, message: "Already a member" });

    project.joinRequests.push({ user: req.user._id, role, message });
    await project.save();

    // Notification create karo — io pass karo
    await createNotification({
      recipient: project.creator._id,
      sender: req.user._id,
      type: "project_request",
      title: "New Project Join Request",
      message: `${req.user.name} wants to join "${project.title}" as ${role}`,
      link: `/projects/${project._id}`,
      io: req.io, // Socket.io instance
    });

    res.json({ success: true, message: "Join request sent successfully!" });
  } catch (err) { next(err); }
};

// @desc  Respond to join request
// @route PUT /api/projects/:id/request/:requestId
exports.respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Only project creator can respond" });

    const requestIdx = project.joinRequests.findIndex(
      r => r._id.toString() === req.params.requestId
    );
    if (requestIdx < 0) return res.status(404).json({ success: false, message: "Request not found" });

    const request = project.joinRequests[requestIdx];
    project.joinRequests[requestIdx].status = status;

    if (status === "accepted") {
      project.members.push({ user: request.user, role: request.role });
    }

    await project.save();

    // Requester ko notification bhejo
    const notifType = status === "accepted" ? "project_accepted" : "project_rejected";
    const notifTitle = status === "accepted" ? "Project Request Accepted! 🎉" : "Project Request Rejected";
    const notifMessage = status === "accepted"
      ? `Your request to join "${project.title}" as ${request.role} has been accepted!`
      : `Your request to join "${project.title}" was not accepted this time.`;

    await createNotification({
      recipient: request.user,
      sender: req.user._id,
      type: notifType,
      title: notifTitle,
      message: notifMessage,
      link: `/projects/${project._id}`,
      io: req.io, // Socket.io instance
    });

    res.json({ success: true, message: `Request ${status} successfully!` });
  } catch (err) { next(err); }
};
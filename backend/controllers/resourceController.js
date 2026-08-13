const Resource = require("../models/Resource");
const User = require("../models/User");
const { detectDuplicate } = require("../services/aiService");
const { createNotification } = require("../services/notificationService");

// @desc  Upload resource
// @route POST /api/resources
exports.uploadResource = async (req, res, next) => {
  try {
    const { title, description, category, subject, semester, branch, universityId, collegeId, tags } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Cloudinary pe manually upload karo correct resource_type ke saath
    const { uploadToCloudinary } = require("../middleware/upload");
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "edubridge/resources"
    );

    console.log("Cloudinary Result:", result);
    console.log("Cloudinary URL:", result.secure_url);

    // Tags parse karo
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    const resource = await Resource.create({
      title, description, category, subject,
      semester: semester ? parseInt(semester) : undefined,
      branch,
      universityId: universityId || undefined,
      collegeId: collegeId || undefined,
      tags: parsedTags,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype.split("/")[1],
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      isDuplicate: false,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { contributionScore: 10, uploadedResourcesCount: 1 },
    });

    await resource.populate("uploadedBy", "name profilePhoto");
    res.status(201).json({ success: true, data: resource });
  } catch (err) { next(err); }
};

// @desc  Get resources with filters & pagination
// @route GET /api/resources
exports.getResources = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, semester, branch, universityId, collegeId,
      subject, sortBy = "newest", search } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (semester) query.semester = parseInt(semester);
    if (branch) query.branch = branch;
    if (universityId) query.universityId = universityId;
    if (collegeId) query.collegeId = collegeId;
    if (subject) query.subject = new RegExp(subject, "i");
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { downloadCount: -1 },
      rating: { averageRating: -1 },
    };

    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .populate("uploadedBy", "name profilePhoto collegeName")
      .populate("universityId", "name shortName")
      .sort(sortOptions[sortBy] || { createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: resources,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (err) { next(err); }
};

// @desc  Get single resource
// @route GET /api/resources/:id
exports.getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("uploadedBy", "name profilePhoto collegeName branch");
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    await Resource.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true, data: resource });
  } catch (err) { next(err); }
};

// @desc  Download resource
// @route POST /api/resources/:id/download
exports.downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id, { $inc: { downloadCount: 1 } }, { new: true }
    );
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    await User.findByIdAndUpdate(resource.uploadedBy, { $inc: { contributionScore: 1 } });

    let fileUrl = resource.fileUrl;

    // Cloudinary PDF fix — use delivery URL with attachment flag
    if (fileUrl && fileUrl.includes("cloudinary.com")) {
      // image/upload → raw/upload for PDFs
      if (fileUrl.includes("/image/upload/")) {
        fileUrl = fileUrl.replace("/image/upload/", "/image/upload/fl_attachment/");
      } else if (fileUrl.includes("/raw/upload/")) {
        fileUrl = fileUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/");
      }
    }

    // URL clean karo — koi fl_attachment nahi
let cleanUrl = fileUrl;
if (cleanUrl) {
  cleanUrl = cleanUrl
    .replace("/image/upload/fl_attachment/", "/image/upload/")
    .replace("/raw/upload/fl_attachment/", "/raw/upload/");
}
res.json({ success: true, fileUrl: cleanUrl });
  } catch (err) { next(err); }
};

// @desc  Rate resource
// @route POST /api/resources/:id/rate
exports.rateResource = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    const existingIdx = resource.ratings.findIndex(r => r.user.toString() === req.user._id.toString());
    if (existingIdx >= 0) {
      resource.ratings[existingIdx].rating = rating;
    } else {
      resource.ratings.push({ user: req.user._id, rating });
    }

    resource.averageRating = resource.ratings.reduce((a, b) => a + b.rating, 0) / resource.ratings.length;
    await resource.save();

    res.json({ success: true, averageRating: resource.averageRating });
  } catch (err) { next(err); }
};

// @desc  Delete resource
// @route DELETE /api/resources/:id
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "super_admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    resource.isActive = false;
    await resource.save();
    res.json({ success: true, message: "Resource removed" });
  } catch (err) { next(err); }
};
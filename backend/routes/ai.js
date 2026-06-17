// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");
// const {
//   getResourceRecommendations,
//   getCareerRecommendations,
//   analyzeResume,
//   smartSearch,
// } = require("../services/aiService");

// // Resource recommendations
// router.get("/recommendations/resources", protect, async (req, res, next) => {
//   try {
//     const data = await getResourceRecommendations(req.user._id);
//     res.json({ success: true, data });
//   } catch (err) { next(err); }
// });

// // Career recommendations
// router.post("/recommendations/career", protect, async (req, res, next) => {
//   try {
//     const skills = req.body.skills || req.user.skills;
//     const data = await getCareerRecommendations(skills);
//     res.json({ success: true, data });
//   } catch (err) { next(err); }
// });

// // Resume analysis
// router.post("/resume/analyze", protect, async (req, res, next) => {
//   try {
//     const { resumeText } = req.body;
//     const data = await analyzeResume(resumeText, req.user.skills);
//     res.json({ success: true, data });
//   } catch (err) { next(err); }
// });

// // Smart search
// router.post("/search", protect, async (req, res, next) => {
//   try {
//     const { query } = req.body;
//     const data = await smartSearch(query);
//     res.json({ success: true, data });
//   } catch (err) { next(err); }
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getResourceRecommendations,
  getCareerRecommendations,
  analyzeResume,
  smartSearch,
  getInternshipRecommendations,
} = require("../services/aiService");

// ── 1. Resource Recommendations ──
router.get("/recommendations/resources", protect, async (req, res, next) => {
  try {
    const data = await getResourceRecommendations(req.user._id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── 2. Career Recommendations ──
router.post("/recommendations/career", protect, async (req, res, next) => {
  try {
    const skills = req.body.skills || req.user.skills || [];
    if (skills.length === 0) {
      return res.json({ success: true, data: [], message: "Add skills to your profile for better recommendations" });
    }
    const data = await getCareerRecommendations(skills);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── 3. Resume Analysis ──
router.post("/resume/analyze", protect, async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: "Please provide resume text (minimum 50 characters)" });
    }
    const data = await analyzeResume(resumeText, req.user.skills || []);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── 4. Smart Search ──
router.post("/search", protect, async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Search query required" });
    }
    const data = await smartSearch(query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── 5. Internship Recommendations ──
router.get("/recommendations/internships", protect, async (req, res, next) => {
  try {
    const data = await getInternshipRecommendations(req.user._id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ── 6. AI Health Check ──
router.get("/status", protect, async (req, res) => {
  res.json({
    success: true,
    status: process.env.GEMINI_API_KEY ? "active" : "inactive",
    model: "gemini-1.5-flash",
    features: [
      "Resource Recommendations",
      "Career Path Advisor",
      "Resume Analyzer",
      "Smart Search",
      "Team Matching",
      "Internship Recommendations",
    ],
  });
});

module.exports = router;
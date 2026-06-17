// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");
// const User = require("../models/User");
// const Resource = require("../models/Resource");
// const Project = require("../models/Project");
// const Mentorship = require("../models/Mentorship");
// const Opportunity = require("../models/Opportunity");
// const Book = require("../models/Book");

// router.get("/", protect, async (req, res, next) => {
//   try {
//     const [
//       totalResources,
//       totalUsers,
//       openProjects,
//       activeMentors,
//       activeOpportunities,
//       availableBooks,
//     ] = await Promise.all([
//       Resource.countDocuments({ isActive: true }),
//       User.countDocuments({ isActive: true }),
//       Project.countDocuments({ isActive: true, status: "open" }),
//       Mentorship.countDocuments({ isActive: true }),
//       Opportunity.countDocuments({ isActive: true, isApproved: true }),
//       Book.countDocuments({ isActive: true, availability: "available" }),
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalResources,
//         totalUsers,
//         openProjects,
//         activeMentors,
//         activeOpportunities,
//         availableBooks,
//       },
//     });
//   } catch (err) { next(err); }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Resource = require("../models/Resource");
const Project = require("../models/Project");
const Mentorship = require("../models/Mentorship");
const Opportunity = require("../models/Opportunity");

// Public route — no auth required
router.get("/", async (req, res, next) => {
  try {
    const [totalResources, totalUsers, openProjects, activeMentors, activeOpportunities] =
      await Promise.all([
        Resource.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: true }),
        Project.countDocuments({ isActive: true, status: "open" }),
        Mentorship.countDocuments({ isActive: true }),
        Opportunity.countDocuments({ isActive: true, isApproved: true }),
      ]);

    res.json({
      success: true,
      data: { totalResources, totalUsers, openProjects, activeMentors, activeOpportunities },
    });
  } catch (err) { next(err); }
});

module.exports = router;
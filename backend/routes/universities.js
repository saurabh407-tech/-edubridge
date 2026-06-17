const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { University, College } = require("../models/University");

router.get("/", async (req, res, next) => {
  try {
    const { state, search } = req.query;
    const query = { isActive: true };
    if (state) query.state = state;
    if (search) query.$text = { $search: search };
    const universities = await University.find(query).sort({ name: 1 });
    res.json({ success: true, data: universities });
  } catch (err) { next(err); }
});

router.get("/:id/colleges", async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { universityId: req.params.id, isApproved: true };
    if (search) query.$text = { $search: search };
    const colleges = await College.find(query).sort({ name: 1 });
    res.json({ success: true, data: colleges });
  } catch (err) { next(err); }
});

router.post("/colleges/request", protect, async (req, res, next) => {
  try {
    const college = await College.create({ ...req.body, requestedBy: req.user._id, isApproved: false });
    res.status(201).json({ success: true, data: college, message: "College addition request submitted" });
  } catch (err) { next(err); }
});

module.exports = router;

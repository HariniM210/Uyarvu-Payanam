const Cutoff = require("../models/Cutoff");
const College = require("../models/College");
const Course = require("../models/Course");

// @desc    Create cutoff entry
// @route   POST /api/cutoffs
// @access  Admin
exports.createCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.create(req.body);
    res.status(201).json({ success: true, data: cutoff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cutoffs with filters
// @route   GET /api/cutoffs
// @access  Public
exports.getCutoffs = async (req, res) => {
  try {
    const { courseId, collegeId, year } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (collegeId) filter.collegeId = collegeId;
    if (year) filter.year = year;

    const cutoffs = await Cutoff.find(filter)
      .lean()
      .populate("courseId", "courseName branchCode")
      .populate("collegeId", "collegeName collegeCode stream district location")
      .sort({ year: -1 })
      .limit(100); // 👈 Critical fix: Prevent memory crashes from 7000 records

    res.status(200).json({ success: true, count: cutoffs.length, data: cutoffs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cutoff
// @route   PUT /api/cutoffs/:id
// @access  Admin
exports.updateCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: cutoff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete cutoff
// @route   DELETE /api/cutoffs/:id
// @access  Admin
exports.deleteCutoff = async (req, res) => {
  try {
    await Cutoff.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Cutoff deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

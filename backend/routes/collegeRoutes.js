const express = require("express");
const {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  bulkInsertColleges,
} = require("../controllers/collegeController");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Public routes
router.get("/", getAllColleges);
router.get("/:id", getCollegeById);

// Admin-protected routes
router.post("/", verifyAdmin, createCollege);
router.post("/bulk", verifyAdmin, bulkInsertColleges);
router.put("/:id", verifyAdmin, updateCollege);
router.delete("/:id", verifyAdmin, deleteCollege);

module.exports = router;

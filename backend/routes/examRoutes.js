const express = require("express");
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const router = express.Router();

// POST - Create new exam
router.post("/", createExam);

// GET - Get all exams
router.get("/", getAllExams);

// GET - Get single exam by ID
router.get("/:id", getExamById);

// PUT - Update exam
router.put("/:id", updateExam);

// DELETE - Delete exam
router.delete("/:id", deleteExam);

module.exports = router;

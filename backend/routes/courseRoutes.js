const express = require("express");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

// POST - Create new course
router.post("/", createCourse);

// GET - Get all courses
router.get("/", getAllCourses);

// GET - Get single course by ID
router.get("/:id", getCourseById);

// PUT - Update course
router.put("/:id", updateCourse);

// DELETE - Delete course
router.delete("/:id", deleteCourse);

module.exports = router;

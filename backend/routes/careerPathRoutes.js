const express = require("express");
const {
  createCareerPath,
  getAllCareerPaths,
  getCareerPathById,
  updateCareerPath,
  deleteCareerPath,
} = require("../controllers/careerPathController");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// GET - Get all career paths
router.get("/", getAllCareerPaths);

// GET - Get single career path by ID
router.get("/:id", getCareerPathById);

// POST - Create new career path
router.post("/", verifyAdmin, createCareerPath);

// PUT - Update career path
router.put("/:id", verifyAdmin, updateCareerPath);

// DELETE - Delete career path
router.delete("/:id", verifyAdmin, deleteCareerPath);

module.exports = router;

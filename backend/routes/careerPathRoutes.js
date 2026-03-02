const express = require("express");
const {
  createCareerPath,
  getAllCareerPaths,
  getCareerPathById,
  updateCareerPath,
  deleteCareerPath,
} = require("../controllers/careerPathController");

const router = express.Router();

// POST - Create new career path
router.post("/", createCareerPath);

// GET - Get all career paths
router.get("/", getAllCareerPaths);

// GET - Get single career path by ID
router.get("/:id", getCareerPathById);

// PUT - Update career path
router.put("/:id", updateCareerPath);

// DELETE - Delete career path
router.delete("/:id", deleteCareerPath);

module.exports = router;

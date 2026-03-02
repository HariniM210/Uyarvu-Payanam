const CareerPath = require("../models/CareerPath");

// @desc    Create new career path
// @route   POST /api/career-paths
// @access  Admin
exports.createCareerPath = async (req, res) => {
  try {
    console.log('🔵 [Backend] POST /api/career-paths - Request received');
    console.log('📦 Request Body:', req.body);
    
    const { title, ageGroup, level, careerDirections, description } = req.body;

    // Validation
    if (!title || !ageGroup || !level || !careerDirections || !description) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    if (!Array.isArray(careerDirections) || careerDirections.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Career directions must be a non-empty array" 
      });
    }

    // Create career path
    console.log('💾 Attempting to save to MongoDB...');
    const careerPath = await CareerPath.create({
      title,
      ageGroup,
      level,
      careerDirections,
      description,
    });

    console.log('✅ Career path saved successfully:', careerPath._id);
    res.status(201).json({
      success: true,
      message: "Career path created successfully",
      data: careerPath,
    });
  } catch (error) {
    console.error('❌ [Backend] Error creating career path:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create career path",
      error: error.message,
    });
  }
};

// @desc    Get all career paths
// @route   GET /api/career-paths
// @access  Public
exports.getAllCareerPaths = async (req, res) => {
  try {
    const careerPaths = await CareerPath.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: careerPaths.length,
      data: careerPaths,
    });
  } catch (error) {
    console.error("Error fetching career paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career paths",
      error: error.message,
    });
  }
};

// @desc    Get single career path by ID
// @route   GET /api/career-paths/:id
// @access  Public
exports.getCareerPathById = async (req, res) => {
  try {
    const careerPath = await CareerPath.findById(req.params.id);

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: "Career path not found",
      });
    }

    res.status(200).json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    console.error("Error fetching career path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career path",
      error: error.message,
    });
  }
};

// @desc    Update career path
// @route   PUT /api/career-paths/:id
// @access  Admin
exports.updateCareerPath = async (req, res) => {
  try {
    const { title, ageGroup, level, careerDirections, description } = req.body;

    // Find career path
    let careerPath = await CareerPath.findById(req.params.id);

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: "Career path not found",
      });
    }

    // Update fields
    if (title) careerPath.title = title;
    if (ageGroup) careerPath.ageGroup = ageGroup;
    if (level) careerPath.level = level;
    if (careerDirections) careerPath.careerDirections = careerDirections;
    if (description) careerPath.description = description;

    await careerPath.save();

    res.status(200).json({
      success: true,
      message: "Career path updated successfully",
      data: careerPath,
    });
  } catch (error) {
    console.error("Error updating career path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update career path",
      error: error.message,
    });
  }
};

// @desc    Delete career path
// @route   DELETE /api/career-paths/:id
// @access  Admin
exports.deleteCareerPath = async (req, res) => {
  try {
    const careerPath = await CareerPath.findById(req.params.id);

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: "Career path not found",
      });
    }

    await careerPath.deleteOne();

    res.status(200).json({
      success: true,
      message: "Career path deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting career path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete career path",
      error: error.message,
    });
  }
};

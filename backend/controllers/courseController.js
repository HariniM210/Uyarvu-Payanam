const Course = require("../models/Course");

// @desc    Create new course
// @route   POST /api/courses
// @access  Admin
exports.createCourse = async (req, res) => {
  try {
    console.log('🔵 [Backend] POST /api/courses - Request received');
    console.log('📦 Request Body:', req.body);
    
    const { courseName, category, level, duration, eligibility, futureScope } = req.body;

    // Validation
    if (!courseName || !category || !level || !duration || !eligibility || !futureScope) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Create course
    console.log('💾 Attempting to save to MongoDB...');
    const course = await Course.create({
      courseName,
      category,
      level,
      duration,
      eligibility,
      futureScope,
    });

    console.log('✅ Course saved successfully:', course._id);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ [Backend] Error creating course:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    console.log('🔵 [Backend] GET /api/courses - Fetching courses');
    const { level, category } = req.query;
    const filter = {};

    if (level) filter.level = level;
    if (category) filter.category = category;

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    console.log('✅ Retrieved', courses.length, 'courses');
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin
exports.updateCourse = async (req, res) => {
  try {
    console.log('🔵 [Backend] PUT /api/courses/:id - Update request');
    console.log('📦 Request Body:', req.body);
    
    const { courseName, category, level, duration, eligibility, futureScope } = req.body;

    // Find course
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    if (courseName) course.courseName = courseName;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration) course.duration = duration;
    if (eligibility) course.eligibility = eligibility;
    if (futureScope) course.futureScope = futureScope;

    await course.save();

    console.log('✅ Course updated successfully:', course._id);
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ [Backend] Error updating course:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin
exports.deleteCourse = async (req, res) => {
  try {
    console.log('🔵 [Backend] DELETE /api/courses/:id');
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.deleteOne();

    console.log('✅ Course deleted successfully');
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error('❌ [Backend] Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

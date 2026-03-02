const Exam = require("../models/Exam");

// @desc    Create new exam
// @route   POST /api/exams
// @access  Admin
exports.createExam = async (req, res) => {
  try {
    console.log('🔵 [Backend] POST /api/exams - Request received');
    console.log('📦 Request Body:', req.body);
    
    const { examName, conductingBody, level, importantDate, applicationLink, officialWebsite, description } = req.body;

    // Validation
    if (!examName || !conductingBody || !level || !importantDate) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: "examName, conductingBody, level, and importantDate are required" 
      });
    }

    // Create exam
    console.log('💾 Attempting to save to MongoDB...');
    const exam = await Exam.create({
      examName,
      conductingBody,
      level,
      importantDate,
      applicationLink,
      officialWebsite,
      description,
    });

    console.log('✅ Exam saved successfully:', exam._id);
    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error('❌ [Backend] Error creating exam:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create exam",
      error: error.message,
    });
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
exports.getAllExams = async (req, res) => {
  try {
    console.log('🔵 [Backend] GET /api/exams - Fetching all exams');
    const exams = await Exam.find().sort({ createdAt: -1 });

    console.log('✅ Retrieved', exams.length, 'exams');
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching exams:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

// @desc    Get single exam by ID
// @route   GET /api/exams/:id
// @access  Public
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error('❌ [Backend] Error fetching exam:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
      error: error.message,
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Admin
exports.updateExam = async (req, res) => {
  try {
    console.log('🔵 [Backend] PUT /api/exams/:id - Update request');
    console.log('📦 Request Body:', req.body);
    
    const { examName, conductingBody, level, importantDate, applicationLink, officialWebsite, description } = req.body;

    // Find exam
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Update fields
    if (examName) exam.examName = examName;
    if (conductingBody) exam.conductingBody = conductingBody;
    if (level) exam.level = level;
    if (importantDate) exam.importantDate = importantDate;
    if (applicationLink !== undefined) exam.applicationLink = applicationLink;
    if (officialWebsite !== undefined) exam.officialWebsite = officialWebsite;
    if (description !== undefined) exam.description = description;

    await exam.save();

    console.log('✅ Exam updated successfully:', exam._id);
    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error('❌ [Backend] Error updating exam:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Admin
exports.deleteExam = async (req, res) => {
  try {
    console.log('🔵 [Backend] DELETE /api/exams/:id');
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await exam.deleteOne();

    console.log('✅ Exam deleted successfully');
    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error('❌ [Backend] Error deleting exam:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};

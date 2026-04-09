const Course = require("../models/Course");
const { allSourceCourses, SOURCE_URL, SOURCE_NAME } = require("../data/sourceCoursesAfter12th");

// ─── Normalize helper for duplicate checking ──────────────────────
const normalize = (str) => String(str || "").trim().toLowerCase();

// ─── Build unique key ─────────────────────────────────────────────
const uniqueKey = (c) =>
  `${normalize(c.courseName)}|${normalize(c.category)}|${normalize(c.targetLevel)}`;

// @desc    Create new course
// @route   POST /api/courses
// @access  Admin
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ Error creating course:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? "Course name already exists" : "Failed to create course",
      error: error.message,
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { level, targetLevel, category } = req.query;
    const filter = {};

    if (level) filter.level = level;
    if (targetLevel) filter.targetLevel = targetLevel;
    if (category) filter.category = category;

    const courses = await Course.find(filter).sort({ courseName: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// @desc    Get single course by ID or Slug
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const isId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: req.params.id } : { slug: req.params.id };
    
    const course = await Course.findOne(query);

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
    console.error('❌ Error fetching course:', error);
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
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error('❌ Error updating course:', error);
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
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

// @desc    Bulk import courses from parsed text
// @route   POST /api/courses/bulk
// @access  Admin
exports.bulkImportCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ success: false, message: "No courses provided for import" });
    }

    let insertedCount = 0;
    let skippedCount = 0;
    const insertedCourses = [];

    // Process sequentially to safely check duplicates based on normalized combination
    for (const data of courses) {
      const query = {
        courseName: new RegExp(`^${normalize(data.courseName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i")
      };

      const existingCourse = await Course.findOne(query);

      if (!existingCourse) {
        const newCourse = new Course({
          ...data,
          isImported: true
        });
        await newCourse.save();
        insertedCourses.push(newCourse);
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Import complete. Added ${insertedCount} new courses. Skipped ${skippedCount} duplicates.`,
      stats: { inserted: insertedCount, skipped: skippedCount },
      data: insertedCourses
    });

  } catch (error) {
    console.error('❌ Error bulk importing courses:', error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk import courses",
      error: error.message,
    });
  }
};

// ════════════════════════════════════════════════════════════════════
//  NEW: Source-based import endpoints
// ════════════════════════════════════════════════════════════════════

// @desc    Preview import from source (dry run)
// @route   POST /api/courses/preview-import
// @access  Admin
exports.previewSourceImport = async (req, res) => {
  try {
    const { categories } = req.body; // optional filter by category

    // Get source courses - optionally filtered
    let sourceCourses = [...allSourceCourses];
    if (categories && Array.isArray(categories) && categories.length > 0) {
      sourceCourses = sourceCourses.filter(c =>
        categories.map(normalize).includes(normalize(c.category))
      );
    }

    // Get existing courses from DB for duplicate comparison
    const existingCourses = await Course.find({}, "courseName category targetLevel").lean();
    const existingKeys = new Set(existingCourses.map(c => uniqueKey(c)));

    const newCourses = [];
    const duplicateCourses = [];

    for (const course of sourceCourses) {
      const key = uniqueKey(course);
      if (existingKeys.has(key)) {
        duplicateCourses.push(course);
      } else {
        newCourses.push(course);
      }
    }

    // Group by category for display
    const categoryBreakdown = {};
    for (const c of sourceCourses) {
      if (!categoryBreakdown[c.category]) {
        categoryBreakdown[c.category] = { total: 0, new: 0, duplicate: 0 };
      }
      categoryBreakdown[c.category].total++;
    }
    for (const c of newCourses) {
      if (categoryBreakdown[c.category]) categoryBreakdown[c.category].new++;
    }
    for (const c of duplicateCourses) {
      if (categoryBreakdown[c.category]) categoryBreakdown[c.category].duplicate++;
    }

    res.status(200).json({
      success: true,
      preview: {
        sourceUrl: SOURCE_URL,
        sourceName: SOURCE_NAME,
        totalFromSource: sourceCourses.length,
        totalNew: newCourses.length,
        totalDuplicates: duplicateCourses.length,
        categoryBreakdown,
        newCourses,
        duplicateCourses: duplicateCourses.map(c => c.courseName),
      }
    });

  } catch (error) {
    console.error('❌ Error previewing source import:', error);
    res.status(500).json({
      success: false,
      message: "Failed to preview source import",
      error: error.message,
    });
  }
};

// @desc    Import courses from source (actual insert)
// @route   POST /api/courses/import-from-source
// @access  Admin
exports.importFromSource = async (req, res) => {
  try {
    const { categories, selectedCourseNames } = req.body; // optional filters

    // Get source courses
    let sourceCourses = [...allSourceCourses];

    // Filter by categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      sourceCourses = sourceCourses.filter(c =>
        categories.map(normalize).includes(normalize(c.category))
      );
    }

    // Filter by selected course names if provided
    if (selectedCourseNames && Array.isArray(selectedCourseNames) && selectedCourseNames.length > 0) {
      const selectedSet = new Set(selectedCourseNames.map(normalize));
      sourceCourses = sourceCourses.filter(c => selectedSet.has(normalize(c.courseName)));
    }

    // Get existing courses for duplicate check
    const existingCourses = await Course.find({}, "courseName category targetLevel").lean();
    const existingKeys = new Set(existingCourses.map(c => uniqueKey(c)));

    let insertedCount = 0;
    let skippedCount = 0;
    const insertedCourses = [];
    const skippedNames = [];

    for (const courseData of sourceCourses) {
      const key = uniqueKey(courseData);

      if (existingKeys.has(key)) {
        skippedCount++;
        skippedNames.push(courseData.courseName);
        continue;
      }

      // Also do a DB-level check on courseName to catch edge cases
      const dbCheck = await Course.findOne({
        courseName: new RegExp(`^${normalize(courseData.courseName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i")
      });

      if (dbCheck) {
        skippedCount++;
        skippedNames.push(courseData.courseName);
        existingKeys.add(key);
        continue;
      }

      const newCourse = new Course({
        ...courseData,
        isImported: true,
      });
      await newCourse.save();
      insertedCourses.push(newCourse);
      insertedCount++;
      existingKeys.add(key); // prevent within-batch duplicates
    }

    res.status(200).json({
      success: true,
      message: `Source import complete. Added ${insertedCount} new courses. Skipped ${skippedCount} duplicates.`,
      stats: {
        inserted: insertedCount,
        skipped: skippedCount,
        total: sourceCourses.length,
      },
      skippedNames,
      data: insertedCourses,
    });

  } catch (error) {
    console.error('❌ Error importing from source:', error);
    res.status(500).json({
      success: false,
      message: "Failed to import from source",
      error: error.message,
    });
  }
};

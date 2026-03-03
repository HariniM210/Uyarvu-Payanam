const College = require("../models/College");

// @desc    Create new college
// @route   POST /api/colleges
// @access  Admin
exports.createCollege = async (req, res) => {
  try {
    const { collegeName, stream, district, location, state, feesPerYear, placementPercentage, rank, accreditation, coursesOffered } = req.body;

    // Validation
    if (!collegeName || !stream) {
      return res.status(400).json({
        success: false,
        message: "College name and stream are required",
      });
    }

    const college = await College.create({
      collegeName,
      stream,
      district,
      location,
      state,
      feesPerYear,
      placementPercentage,
      rank,
      accreditation,
      coursesOffered,
    });

    res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (error) {
    console.error("Create college error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create college",
      error: error.message,
    });
  }
};

// @desc    Get all colleges (with optional stream & search filters)
// @route   GET /api/colleges?stream=Engineering&search=IIT
// @access  Public
exports.getAllColleges = async (req, res) => {
  try {
    const { stream, district, search } = req.query;
    const filter = {};

    // Filter by stream
    if (stream && stream !== "All") {
      filter.stream = stream;
    }

    // Filter by district
    if (district && district !== "All") {
      filter.district = { $regex: district, $options: "i" };
    }

    // Search by college name or location
    if (search) {
      filter.$or = [
        { collegeName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    const colleges = await College.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    console.error("Get colleges error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch colleges",
      error: error.message,
    });
  }
};

// @desc    Get single college by ID
// @route   GET /api/colleges/:id
// @access  Public
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("Get college error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch college",
      error: error.message,
    });
  }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Admin
exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const allowedFields = [
      "collegeName",
      "stream",
      "district",
      "location",
      "state",
      "feesPerYear",
      "placementPercentage",
      "rank",
      "accreditation",
      "coursesOffered",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        college[field] = req.body[field];
      }
    });

    await college.save();

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (error) {
    console.error("Update college error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update college",
      error: error.message,
    });
  }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Admin
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    await college.deleteOne();

    res.status(200).json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    console.error("Delete college error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete college",
      error: error.message,
    });
  }
};

// @desc    Bulk insert colleges (placeholder for PDF data import)
// @route   POST /api/colleges/bulk
// @access  Admin
exports.bulkInsertColleges = async (req, res) => {
  try {
    const { colleges } = req.body;

    if (!Array.isArray(colleges) || colleges.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of colleges in the request body",
      });
    }

    const result = await College.insertMany(colleges, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${result.length} colleges inserted successfully`,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Bulk insert error:", error);

    // insertMany with ordered:false continues on error — report partial success
    if (error.insertedDocs && error.insertedDocs.length > 0) {
      return res.status(207).json({
        success: false,
        message: `Partial insert: ${error.insertedDocs.length} succeeded, some failed`,
        insertedCount: error.insertedDocs.length,
        errors: error.writeErrors?.map((e) => e.errmsg),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to bulk insert colleges",
      error: error.message,
    });
  }
};

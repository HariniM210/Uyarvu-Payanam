const CareerPath = require("../models/CareerPath");

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildCareerPathPayload(body = {}, existing = null) {
  const roadmap = normalizeList(body.roadmap || body.steps);
  const relatedCourses = normalizeList(body.relatedCourses);
  const futureOpportunities = normalizeList(body.futureOpportunities || body.careerDirections);
  const legacyDirections = normalizeList(body.careerDirections || body.futureOpportunities);

  return {
    title: body.title?.trim() || existing?.title || "",
    level: body.level?.trim() || existing?.level || "",
    description: body.description?.trim() || existing?.description || "",
    sections: body.sections || existing?.sections || [],
    roadmap: roadmap.length > 0 ? roadmap : existing?.roadmap || [],
    relatedCourses: relatedCourses.length > 0 ? relatedCourses : existing?.relatedCourses || [],
    futureOpportunities: futureOpportunities.length > 0 ? futureOpportunities : existing?.futureOpportunities || [],
    interestArea: body.interestArea?.trim() || existing?.interestArea || "General",
    isRecommended:
      typeof body.isRecommended === "boolean"
        ? body.isRecommended
        : typeof body.isRecommended === "string"
          ? body.isRecommended === "true"
          : existing?.isRecommended || false,
    ageGroup: body.ageGroup?.trim() || existing?.ageGroup || "",
    careerDirections: legacyDirections.length > 0 ? legacyDirections : existing?.careerDirections || [],
  };
}

function validateCareerPathPayload(payload) {
  if (!payload.title || !payload.level || !payload.description) {
    return "Title, class level, and description are required";
  }

  // Allow empty roadmap for Class 5 if sections are provided
  if (payload.level !== '5' && (!Array.isArray(payload.roadmap) || payload.roadmap.length === 0)) {
    return "At least one roadmap step is required";
  }

  return null;
}

exports.createCareerPath = async (req, res) => {
  try {
    const payload = buildCareerPathPayload(req.body);
    const validationError = validateCareerPathPayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const careerPath = await CareerPath.create(payload);

    res.status(201).json({
      success: true,
      message: "Career path created successfully",
      data: careerPath,
    });
  } catch (error) {
    console.error("Error creating career path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create career path",
      error: error.message,
    });
  }
};

exports.getAllCareerPaths = async (req, res) => {
  try {
    const { level, interestArea, recommended } = req.query;
    const filter = {};

    if (level) filter.level = level;
    if (interestArea) filter.interestArea = interestArea;
    if (recommended === "true") filter.isRecommended = true;

    const careerPaths = await CareerPath.find(filter).sort({ isRecommended: -1, createdAt: -1 });

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

exports.updateCareerPath = async (req, res) => {
  try {
    const existing = await CareerPath.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Career path not found",
      });
    }

    const payload = buildCareerPathPayload(req.body, existing);
    const validationError = validateCareerPathPayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    Object.assign(existing, payload);
    await existing.save();

    res.status(200).json({
      success: true,
      message: "Career path updated successfully",
      data: existing,
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

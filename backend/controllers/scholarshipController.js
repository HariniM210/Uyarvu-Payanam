const path = require("path");
const xlsx = require("xlsx");
const Scholarship = require("../models/Scholarship");

const normalizeString = (v) => (v === null || v === undefined ? "" : String(v).trim());

const normalizeLevel = (v) => {
  const s = normalizeString(v);
  const map = {
    "5": "5th",
    "5th": "5th",
    "8": "8th",
    "8th": "8th",
    "10": "10th",
    "10th": "10th",
    "12": "12th",
    "12th": "12th",
    "graduate": "Graduate",
    "Graduation": "Graduate",
    "Graduate": "Graduate",
  };
  return map[s] || map[s.toLowerCase()] || s; // fallback
};

const parseDocuments = (v) => {
  if (Array.isArray(v)) return v.map((x) => normalizeString(x)).filter(Boolean);
  const s = normalizeString(v);
  if (!s) return [];
  // split by comma / newline / semicolon
  return s
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);
};

// @desc    Create scholarship manually
// @route   POST /api/scholarships
exports.createScholarship = async (req, res) => {
  try {
    console.log("🔵 [Backend] POST /api/scholarships - Request received");
    console.log("📦 Request Body:", req.body);

    const {
      scholarshipName,
      level,
      incomeLimit,
      deadline,
      requiredDocuments,
      applicationLink,
      description,
      status,
    } = req.body;

    if (!scholarshipName || !level) {
      return res.status(400).json({
        success: false,
        message: "scholarshipName and level are required",
      });
    }

    const docs = Array.isArray(requiredDocuments)
      ? requiredDocuments.map((d) => normalizeString(d)).filter(Boolean)
      : parseDocuments(requiredDocuments);

    // duplicate check (basic)
    const existing = await Scholarship.findOne({
      scholarshipName: scholarshipName.trim(),
      level: normalizeLevel(level),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Scholarship already exists for this level",
      });
    }

    const saved = await Scholarship.create({
      scholarshipName: scholarshipName.trim(),
      level: normalizeLevel(level),
      incomeLimit: normalizeString(incomeLimit),
      deadline: deadline ? new Date(deadline) : null,
      requiredDocuments: docs,
      applicationLink: normalizeString(applicationLink),
      description: normalizeString(description),
      status: status ? normalizeString(status) : "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Scholarship created successfully",
      data: saved,
    });
  } catch (error) {
    console.error("❌ [Backend] Error creating scholarship:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create scholarship",
      error: error.message,
    });
  }
};

// @desc    Get all scholarships
// @route   GET /api/scholarships
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: scholarships.length,
      data: scholarships,
    });
  } catch (error) {
    console.error("❌ [Backend] Error fetching scholarships:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scholarships",
      error: error.message,
    });
  }
};

// @desc    Get scholarship by ID
// @route   GET /api/scholarships/:id
exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    return res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch scholarship", error: error.message });
  }
};

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
exports.updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    const {
      scholarshipName,
      level,
      incomeLimit,
      deadline,
      requiredDocuments,
      applicationLink,
      description,
      status,
    } = req.body;

    if (scholarshipName !== undefined) scholarship.scholarshipName = normalizeString(scholarshipName);
    if (level !== undefined) scholarship.level = normalizeLevel(level);
    if (incomeLimit !== undefined) scholarship.incomeLimit = normalizeString(incomeLimit);
    if (deadline !== undefined) scholarship.deadline = deadline ? new Date(deadline) : null;
    if (requiredDocuments !== undefined) {
      scholarship.requiredDocuments = Array.isArray(requiredDocuments)
        ? requiredDocuments.map((d) => normalizeString(d)).filter(Boolean)
        : parseDocuments(requiredDocuments);
    }
    if (applicationLink !== undefined) scholarship.applicationLink = normalizeString(applicationLink);
    if (description !== undefined) scholarship.description = normalizeString(description);
    if (status !== undefined) scholarship.status = normalizeString(status);

    await scholarship.save();

    return res.status(200).json({
      success: true,
      message: "Scholarship updated successfully",
      data: scholarship,
    });
  } catch (error) {
    console.error("❌ [Backend] Error updating scholarship:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update scholarship",
      error: error.message,
    });
  }
};

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    await scholarship.deleteOne();
    return res.status(200).json({ success: true, message: "Scholarship deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete scholarship", error: error.message });
  }
};

// @desc    Upload Excel and import scholarships
// @route   POST /api/scholarships/upload
exports.uploadScholarshipsExcel = async (req, res) => {
  try {
    console.log("🔵 [Backend] POST /api/scholarships/upload - Upload received");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📄 Uploaded file:", filePath);

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON rows
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    console.log("📊 Rows found:", rows.length);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of rows) {
      try {
        // Flexible column mapping (handles different Excel headings)
        const scholarshipName = normalizeString(row.scholarshipName || row.ScholarshipName || row["Scholarship Name"] || row.Name || row["Scholarship"]);
        const level = normalizeLevel(row.level || row.Level || row.Standard || row.Class);
        const incomeLimit = normalizeString(row.incomeLimit || row["Income Limit"] || row.Income || row["Income"]);
        const deadline = normalizeString(row.deadline || row.Deadline || row["Last Date"] || row["Important Date"]);
        const requiredDocuments = parseDocuments(row.requiredDocuments || row["Required Documents"] || row.Documents);
        const applicationLink = normalizeString(row.applicationLink || row["Application Link"] || row.ApplyLink || row["Apply Link"]);
        const description = normalizeString(row.description || row.Description || row.Remarks);
        const status = normalizeString(row.status || row.Status) || "Active";

        // minimum required
        if (!scholarshipName || !level) {
          skipped++;
          continue;
        }

        const existing = await Scholarship.findOne({ scholarshipName, level });
        if (existing) {
          skipped++;
          continue;
        }

        await Scholarship.create({
          scholarshipName,
          level,
          incomeLimit,
          deadline,
          requiredDocuments,
          applicationLink,
          description,
          status: status === "Expired" ? "Expired" : "Active",
        });

        inserted++;
      } catch (e) {
        errors++;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Excel import completed",
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("❌ [Backend] Upload import failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to import scholarships",
      error: error.message,
    });
  }
};

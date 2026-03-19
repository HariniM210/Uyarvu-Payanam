const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const csvParser = require("csv-parser");
const Scholarship = require("../models/Scholarship");
const ScholarshipApplication = require("../models/ScholarshipApplication");

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
// @route   POST /api/scholarships/add-scholarship
exports.addScholarship = async (req, res) => {
  try {
    let { scholarshipName, provider, amount, eligibility, applicationLink } = req.body;

    if (!scholarshipName) {
      return res.status(400).json({ message: "Scholarship name is required" });
    }

    // Normalize text (trim spaces and lowercase)
    const normalizedName = scholarshipName.trim().toLowerCase();
    const normalizedProvider = provider ? provider.trim().toLowerCase() : "";

    // Check for duplicates
    const existingScholarship = await Scholarship.findOne({ scholarshipName: normalizedName });

    if (existingScholarship) {
      return res.status(409).json({ message: "Scholarship already exists" });
    }

    // Insert new scholarship
    const newScholarship = new Scholarship({
      scholarshipName: normalizedName,
      provider: normalizedProvider,
      amount: amount ? amount.trim() : "",
      eligibility: eligibility ? eligibility.trim() : "",
      applicationLink: applicationLink ? applicationLink.trim() : ""
    });

    await newScholarship.save();

    return res.status(201).json({ 
      message: "Scholarship added successfully",
      data: newScholarship
    });
  } catch (error) {
    // Handle duplicate key error (race-condition safe)
    if (error && (error.code === 11000 || error.code === 11001)) {
      return res.status(409).json({ message: "Scholarship already exists" });
    }
    console.error("❌ [Backend] Error adding scholarship:", error);
    return res.status(500).json({ 
      message: "Server error while adding scholarship", 
      error: error.message 
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

// @desc    Upload CSV/Excel and import scholarships
// @route   POST /api/scholarships/upload
exports.uploadScholarshipsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Read the file
    if (fileExt === 'csv') {
      await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        stream
          .pipe(csvParser({ mapHeaders: ({ header }) => header.trim().replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "") }))
          .on('data', (data) => results.push(data))
          .on('end', () => {
            stream.destroy();
            resolve();
          })
          .on('error', (err) => {
            stream.destroy();
            reject(err);
          });
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      results.push(...rows);
    } else {
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(err){}
      }
      return res.status(400).json({ message: "Invalid file format. Only .csv or .xlsx allowed." });
    }

    let inserted = 0;
    let skipped = 0;

    const findVal = (row, keys) => {
      const rowKeys = Object.keys(row);
      for (let k of rowKeys) {
        const lowerK = k.toLowerCase().trim();
        if (keys.some(searchK => lowerK.includes(searchK))) {
          return row[k];
        }
      }
      return "";
    };

    for (const row of results) {
      try {
        console.log("Row:", row); // DEBUGGING: Log each raw row

        const name = normalizeString(findVal(row, ["name", "scholarship"]));
        const provider = normalizeString(findVal(row, ["provider"]));
        const amount = normalizeString(findVal(row, ["amount"]));
        const eligibility = normalizeString(findVal(row, ["eligibility", "level", "class"]));
        const link = normalizeString(findVal(row, ["link", "url", "apply"]));

        // If any important field is missing -> skip row
        if (!name || name.trim() === "") {
          console.log("Skipping row: Missing Name");
          skipped++;
          continue; 
        }

        // Format for uniqueness
        const normalizedName = name.trim().toLowerCase();
        const normalizedProvider = provider ? provider.trim().toLowerCase() : "";

        // Check Duplicate
        const existing = await Scholarship.findOne({
          scholarshipName: normalizedName,
          provider: normalizedProvider
        });

        if (existing) {
          console.log("Skipping row: Duplicate found ->", name);
          skipped++;
        } else {
          // Insert new record
          await Scholarship.create({
            scholarshipName: normalizedName,
            provider: normalizedProvider,
            amount: amount,
            eligibility: eligibility,
            applicationLink: link,
          });
          inserted++;
          console.log("Inserted row:", name);
        }
      } catch (rowError) {
        console.error("Error inserting row:", row, "->", rowError.message);
        skipped++; // Skip if validation fails (e.g. length limits)
      }
    }

    // Clean up temp file safely
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Could not delete temp file:", err.message);
      }
    }

    return res.status(201).json({
      inserted,
      skipped,
      duplicates: skipped // (Keeping variable to support existing frontend structure)
    });

  } catch (error) {
    console.error("❌ [Backend] Upload import failed:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(500).json({
      message: "Failed to import scholarships",
      error: error.message,
    });
  }
};

// @desc    Apply for scholarship
// @route   POST /api/scholarships/apply
exports.applyForScholarship = async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, scholarshipName, scholarshipProvider } = req.body;
    if (!studentName || !studentEmail || !scholarshipName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const application = await ScholarshipApplication.create({
      studentId: studentId || null,
      studentName,
      studentEmail,
      scholarshipName,
      scholarshipProvider: scholarshipProvider || "Unknown Provider",
      status: "Pending"
    });

    return res.status(201).json({ success: true, message: "Applied successfully", application });
  } catch (error) {
    console.error("❌ Array creating ScholarshipApplication:", error);
    return res.status(500).json({ success: false, message: "Failed to apply for scholarship", error: error.message });
  }
};

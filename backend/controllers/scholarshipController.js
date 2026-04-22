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
    let { 
      scholarshipName, 
      provider, 
      description, 
      benefit, 
      grades, 
      category, 
      eligibility, 
      applicationLink, 
      deadline, 
      image,
      status 
    } = req.body;

    if (!scholarshipName) {
      return res.status(400).json({ message: "Scholarship name is required" });
    }

    // Insert new scholarship
    const newScholarship = new Scholarship({
      scholarshipName: scholarshipName.trim(),
      provider: provider ? provider.trim() : "",
      description: description || "",
      benefit: benefit || "",
      grades: Array.isArray(grades) ? grades : (grades ? [grades] : ["10th"]),
      category: category || "Government",
      eligibility: eligibility ? eligibility.trim() : "",
      applicationLink: applicationLink ? applicationLink.trim() : "",
      deadline: deadline || "",
      image: image || "",
      status: status || "active"
    });

    await newScholarship.save();

    return res.status(201).json({ 
      success: true,
      message: "Scholarship added successfully",
      data: newScholarship
    });
  } catch (error) {
    if (error && (error.code === 11000 || error.code === 11001)) {
      return res.status(409).json({ message: "Scholarship already exists" });
    }
    console.error("❌ Error adding scholarship:", error);
    return res.status(500).json({ message: "Server error while adding scholarship", error: error.message });
  }
};

// @desc    Get all scholarships
// @route   GET /api/scholarships
exports.getAllScholarships = async (req, res) => {
  try {
    const { grade, category, status } = req.query;
    
    let filter = {};
    
    // For user side, usually only show active/published
    if (status) {
      filter.status = status;
    } else if (req.query.userSide === 'true' || req.query.userSide === true) {
      filter.status = { $in: ['active', 'published'] };
    }

    if (grade) {
      const numMatch = grade.match(/\d+/);
      const gradeNum = numMatch ? numMatch[0] : grade;
      const cleanGrade = gradeNum.toString();
      
      const searchStrings = [
        cleanGrade,
        `${cleanGrade}th`,
        `Class ${cleanGrade}`,
        `Grade ${cleanGrade}`,
        `After ${cleanGrade}`
      ];

      filter.$or = [
        { grades: { $in: searchStrings } },
        { targetClass: { $in: searchStrings } },
        { grades: new RegExp(`\\b${cleanGrade}(th)?\\b`, 'i') },
        { targetClass: new RegExp(`\\b${cleanGrade}(th)?\\b`, 'i') }
      ];
    }
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    const scholarships = await Scholarship.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: scholarships.length,
      data: scholarships,
    });
  } catch (error) {
    console.error("❌ Error fetching scholarships:", error);
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
      provider,
      description,
      benefit,
      grades,
      category,
      eligibility,
      applicationLink,
      deadline,
      image,
      status,
    } = req.body;

    if (scholarshipName !== undefined) scholarship.scholarshipName = scholarshipName;
    if (provider !== undefined) scholarship.provider = provider;
    if (description !== undefined) scholarship.description = description;
    if (benefit !== undefined) scholarship.benefit = benefit;
    if (grades !== undefined) scholarship.grades = Array.isArray(grades) ? grades : [grades];
    if (category !== undefined) scholarship.category = category;
    if (eligibility !== undefined) scholarship.eligibility = eligibility;
    if (applicationLink !== undefined) scholarship.applicationLink = applicationLink;
    if (deadline !== undefined) scholarship.deadline = deadline;
    if (image !== undefined) scholarship.image = image;
    if (status !== undefined) scholarship.status = status;

    await scholarship.save();

    return res.status(200).json({
      success: true,
      message: "Scholarship updated successfully",
      data: scholarship,
    });
  } catch (error) {
    console.error("❌ Error updating scholarship:", error);
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

        // Detect grades from eligibility or other fields
        let detectedGrades = [];
        const classNames = ["5th", "8th", "10th", "12th"];
        const searchPool = (name + " " + eligibility + " " + provider).toLowerCase();
        
        classNames.forEach(cls => {
          const num = cls.replace('th', '');
          if (searchPool.includes(cls.toLowerCase()) || searchPool.includes(`class ${num}`) || searchPool.includes(`grade ${num}`)) {
            detectedGrades.push(cls);
          }
        });

        // If no grade detected, default based on common patterns or 10th/12th
        if (detectedGrades.length === 0) {
           if (searchPool.includes("college") || searchPool.includes("degree") || searchPool.includes("university")) {
              detectedGrades = ["12th"];
           } else {
              detectedGrades = ["10th"]; // Default fallback
           }
        }

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
            scholarshipName: name.trim(), // Use original casing for display
            provider: provider.trim(),
            benefit: amount,
            eligibility: eligibility,
            applicationLink: link,
            grades: detectedGrades,
            status: "active"
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

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const College = require('../models/College');
const Course = require('../models/Course');
const CollegeCourseMapping = require('../models/CollegeCourseMapping');

/**
 * Normalizes college name for strong matching.
 * Ignores case, extra spaces, punctuation, special characters, and content inside parentheses.
 */
const normalizeCollegeName = (name) => {
  if (!name) return '';
  return name.toString().toLowerCase()
    .replace(/\([^)]*\)/g, '') // remove parentheses and everything inside
    .replace(/[^a-z0-9]/g, '') // remove non-alphanumeric characters
    .trim();
};

/**
 * Normalizes course name for matching.
 * Ignores case, extra spaces, punctuation, and special characters.
 */
const normalizeCourseName = (name) => {
  if (!name) return '';
  return name.toString().toLowerCase()
    .replace(/^(part-time\s+)?diploma\s+in\s+/i, '') // remove prefix
    .replace(/\s*\(polytechnic\)/i, '') // remove suffix
    .replace(/\s*\(diploma\)/i, '') // remove suffix
    .replace(/[^a-z0-9]/g, '') // remove non-alphanumeric characters
    .trim();
};

/**
 * Main importer function.
 * @param {boolean} forceSync - If true, skips the file modified check and forces the sync.
 */
const importDiplomaExcel = async (forceSync = false) => {
  const startTime = Date.now();
  console.log('[Diploma Import] Starting Diploma/Polytechnic College Course Mapping import...');

  const excelPath = path.join(__dirname, '../uploads/Diploma College with Course Offered (1).xlsx');
  if (!fs.existsSync(excelPath)) {
    console.error(`[Diploma Import] Excel file not found at: ${excelPath}`);
    return {
      success: false,
      error: `Excel file not found at: ${excelPath}`
    };
  }

  // 1. File state tracking to avoid database writes when unchanged
  const stateFilePath = path.join(__dirname, '../uploads/.diploma_excel_state.json');
  const stats = fs.statSync(excelPath);
  const currentMtime = stats.mtimeMs;
  const currentSize = stats.size;

  if (!forceSync && fs.existsSync(stateFilePath)) {
    try {
      const savedState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
      if (savedState.mtimeMs === currentMtime && savedState.size === currentSize) {
        console.log('[Diploma Import] Excel file is unchanged. Skipping database synchronization.');
        return {
          success: true,
          skipped: true,
          message: 'Excel file is unchanged. Database synchronization skipped.'
        };
      }
    } catch (err) {
      console.warn('[Diploma Import] Failed to read or parse state file. Forcing run:', err.message);
    }
  }

  // 2. Read and parse Excel file
  let rows = [];
  try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = xlsx.utils.sheet_to_json(sheet);
  } catch (err) {
    console.error('[Diploma Import] Failed to parse Excel file:', err);
    return { success: false, error: `Excel parsing failed: ${err.message}` };
  }

  const report = {
    totalCollegesInExcel: rows.length,
    matchedColleges: 0,
    insertedColleges: 0,
    updatedColleges: 0, // Colleges that actually had new courses added
    skippedColleges: 0, // Colleges not found in DB
    totalCourseMappingsCreated: 0,
    duplicateMappingsSkipped: 0,
    missingCourses: new Set(),
    timeTakenMs: 0
  };

  const skippedCollegesList = [];

  // Start Mongoose Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Cache all DB colleges and courses in memory to optimize matching
    const [allColleges, allCourses] = await Promise.all([
      College.find({}).session(session),
      Course.find({}).session(session)
    ]);

    const collegeMapByName = new Map();
    const collegeMapByNormName = new Map();
    const collegeMapByCode = new Map();

    allColleges.forEach(c => {
      const name = c.collegeName.trim();
      collegeMapByName.set(name.toLowerCase(), c);
      collegeMapByNormName.set(normalizeCollegeName(name), c);

      if (c.collegeCode) {
        collegeMapByCode.set(String(c.collegeCode).trim(), c);
      }
      const codeMatch = name.match(/\((\d+)\)/);
      if (codeMatch) {
        collegeMapByCode.set(codeMatch[1], c);
      }
    });

    const courseMapByNormName = new Map();
    allCourses.forEach(c => {
      const norm = normalizeCourseName(c.courseName);
      if (norm) {
        const existing = courseMapByNormName.get(norm);
        if (!existing || (c.level === 'diploma' && existing.level !== 'diploma')) {
          courseMapByNormName.set(norm, c);
        }
      }
    });

    const collegeBulkOps = [];
    const mappingBulkOps = [];
    const collegesToInsert = [];

    const batchId = `DIPLOMA-EXCEL-${Date.now()}`;

    // 4. Iterate over Excel rows and process updates
    for (const row of rows) {
      const excelName = row['College Name'] ? String(row['College Name']).trim() : '';
      if (!excelName) continue;

      const excelCode = row['College Code'] ? String(row['College Code']).trim() : '';
      const excelCoursesOfferedRaw = row['Courses Offered'] ? String(row['Courses Offered']).trim() : '';

      // Match college (Master dataset lookup)
      let college = null;
      if (excelCode && collegeMapByCode.has(excelCode)) {
        college = collegeMapByCode.get(excelCode);
      } else if (collegeMapByName.has(excelName.toLowerCase())) {
        college = collegeMapByName.get(excelName.toLowerCase());
      } else {
        const norm = normalizeCollegeName(excelName);
        if (collegeMapByNormName.has(norm)) {
          college = collegeMapByNormName.get(norm);
        }
      }

      let isNewCollege = false;
      if (!college) {
        isNewCollege = true;
        const newCollegeId = new mongoose.Types.ObjectId();
        college = {
          _id: newCollegeId,
          collegeName: excelName,
          collegeCode: excelCode,
          stream: 'Polytechnic',
          streamsOffered: ['Polytechnic', 'Diploma'],
          coursesOffered: [],
          district: row['District'] ? String(row['District']).trim() : '',
          website: row['Official Website'] ? String(row['Official Website']).trim() : '',
          collegeType: row['College Type'] ? String(row['College Type']).trim() : '',
          state: 'Tamil Nadu',
        };
        // Cache it in memory to avoid duplicate inserts if it appears again
        collegeMapByName.set(excelName.toLowerCase(), college);
        collegeMapByNormName.set(normalizeCollegeName(excelName), college);
        if (excelCode) {
          collegeMapByCode.set(String(excelCode).trim(), college);
        }
        collegesToInsert.push(college);
        report.insertedColleges++;
      } else {
        report.matchedColleges++;
      }

      // Check if we need to update college streamsOffered to include 'Diploma'
      let collegeNeedsUpdate = false;
      const updatedStreamsOffered = [...(college.streamsOffered || [])];
      if (!updatedStreamsOffered.includes('Diploma')) {
        updatedStreamsOffered.push('Diploma');
        collegeNeedsUpdate = true;
      }

      const currentCollegeCourses = college.coursesOffered ? college.coursesOffered.map(id => id.toString()) : [];
      const updatedCollegeCourses = [...currentCollegeCourses];

      // Process course mapping list
      if (excelCoursesOfferedRaw) {
        const courseNames = excelCoursesOfferedRaw.split(',').map(c => c.trim()).filter(Boolean);

        for (const rawCourseName of courseNames) {
          const courseNorm = normalizeCourseName(rawCourseName);
          const matchedCourse = courseMapByNormName.get(courseNorm);

          if (!matchedCourse) {
            report.missingCourses.add(rawCourseName);
            continue;
          }

          const matchedCourseIdStr = matchedCourse._id.toString();

          // Check if mapping is already present for this college
          const isAlreadyMapped = currentCollegeCourses.includes(matchedCourseIdStr);

          // Prepare bulk mapping upsert (always upsert to ensure mapping exists)
          mappingBulkOps.push({
            updateOne: {
              filter: { collegeId: college._id, courseId: matchedCourse._id },
              update: {
                $set: {
                  collegeId: college._id,
                  courseId: matchedCourse._id,
                  collegeName: college.collegeName,
                  courseName: matchedCourse.courseName,
                  stream: 'Polytechnic',
                  source: 'Import',
                  sourceFileName: 'Diploma College with Course Offered (1).xlsx',
                  importBatchId: batchId,
                  isVerified: true,
                  isActive: true
                }
              },
              upsert: true
            }
          });

          if (!isAlreadyMapped) {
            if (!updatedCollegeCourses.includes(matchedCourseIdStr)) {
              updatedCollegeCourses.push(matchedCourseIdStr);
              collegeNeedsUpdate = true;
            }
            report.totalCourseMappingsCreated++;
          } else {
            report.duplicateMappingsSkipped++;
          }
        }
      }

      // If college had new streams or courses added, add to bulk updates / set on new college
      if (isNewCollege) {
        college.coursesOffered = updatedCollegeCourses;
        college.streamsOffered = updatedStreamsOffered;
      } else if (collegeNeedsUpdate) {
        collegeBulkOps.push({
          updateOne: {
            filter: { _id: college._id },
            update: {
              $set: {
                streamsOffered: updatedStreamsOffered,
                coursesOffered: updatedCollegeCourses
              }
            }
          }
        });
        report.updatedColleges++;
      }
    }

    // 5. Execute DB writes inside the transaction
    if (collegesToInsert.length > 0) {
      await College.insertMany(collegesToInsert, { session });
    }
    if (collegeBulkOps.length > 0) {
      await College.bulkWrite(collegeBulkOps, { session });
    }
    if (mappingBulkOps.length > 0) {
      await CollegeCourseMapping.bulkWrite(mappingBulkOps, { session });
    }

    // Commit transaction
    await session.commitTransaction();

    // 6. Update the file sync state to track modification metadata
    fs.writeFileSync(
      stateFilePath,
      JSON.stringify({ mtimeMs: currentMtime, size: currentSize }, null, 2),
      'utf8'
    );

    report.timeTakenMs = Date.now() - startTime;

    // Convert Set to Array for reporting
    report.missingCourses = Array.from(report.missingCourses).sort();

    console.log(`[Diploma Import] Sync complete in ${report.timeTakenMs}ms:`);
    console.log(` - Total rows in Excel: ${report.totalCollegesInExcel}`);
    console.log(` - Matched colleges: ${report.matchedColleges}`);
    console.log(` - Inserted colleges: ${report.insertedColleges}`);
    console.log(` - Updated colleges: ${report.updatedColleges}`);
    console.log(` - Skipped colleges (not in DB): ${report.skippedColleges}`);
    console.log(` - New course mappings created: ${report.totalCourseMappingsCreated}`);
    console.log(` - Duplicate mappings skipped: ${report.duplicateMappingsSkipped}`);
    console.log(` - Missing courses skipped: ${report.missingCourses.length}`);

    return {
      success: true,
      stats: report
    };

  } catch (err) {
    // Abort transaction on error to rollback
    console.error('[Diploma Import] Transaction aborted due to error:', err);
    await session.abortTransaction();
    return {
      success: false,
      error: err.message
    };
  } finally {
    session.endSession();
  }
};

module.exports = { importDiplomaExcel };

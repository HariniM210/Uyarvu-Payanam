const mongoose = require("mongoose");

const collegeCourseMappingSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    source: {
      type: String, // "Import", "Manual Verification", "Cutoff Sync"
      default: "Import",
    },
    importBatchId: {
      type: String,
      default: null,
    },
    sourceFileName: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }
  },
  {
    timestamps: true,
  }
);

// Unique constraint to prevent duplicate mappings
collegeCourseMappingSchema.index({ collegeId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("CollegeCourseMapping", collegeCourseMappingSchema);

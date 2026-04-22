const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: { 
      type: String, 
      required: [true, "Scholarship name is required"],
      trim: true,
      minlength: [2, "Scholarship name must be at least 2 characters"],
      maxlength: [200, "Scholarship name must be at most 200 characters"]
    },
    provider: { 
      type: String, 
      trim: true,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    benefit: { 
      type: String, 
      trim: true,
      default: ""
    },
    grades: {
      type: [String], // ["5th", "8th", "10th", "12th"]
      default: ["10th"]
    },
    targetClass: {
      type: [String], // ["5", "8", "10", "12"]
      default: []
    },
    category: {
      type: String,
      enum: ["Government", "State Schemes", "Merit", "NSP", "Process", "Tips", "Others"],
      default: "Government"
    },
    eligibility: { 
      type: String, 
      trim: true,
      default: ""
    },
    applicationLink: { 
      type: String, 
      trim: true,
      maxlength: [1000, "Application link must be at most 1000 characters"]
    },
    stepsToApply: {
      type: [String],
      default: []
    },
    deadline: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive", "published"],
      default: "published"
    }
  },
  { collection: "scholarships", timestamps: true }
);

// Explicit index to guarantee uniqueness at DB level for (name + provider)
scholarshipSchema.index({ scholarshipName: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model("Scholarship", scholarshipSchema);


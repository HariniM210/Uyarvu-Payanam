const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: { 
      type: String, 
      required: [true, "Scholarship name is required"],
      trim: true,
      lowercase: true,
      minlength: [2, "Scholarship name must be at least 2 characters"],
      maxlength: [200, "Scholarship name must be at most 200 characters"]
    },
    provider: { 
      type: String, 
      trim: true,
      lowercase: true,
      default: ""
    },
    amount: { 
      type: String, 
      trim: true 
    },
    eligibility: { 
      type: String, 
      trim: true 
    },
    applicationLink: { 
      type: String, 
      trim: true,
      maxlength: [1000, "Application link must be at most 1000 characters"]
    },
  },
  { collection: "scholarships", timestamps: true }
);

// Explicit index to guarantee uniqueness at DB level for (name + provider) case-insensitively. (Already lowercase due to schema properties)
scholarshipSchema.index({ scholarshipName: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model("Scholarship", scholarshipSchema);

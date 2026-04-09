const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      unique: true,
    },
    branchCode: {
      type: String, // TNEA Branch Code (e.g., CS, IT)
      trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    level: {
      type: String, // "Polytechnic", "B.Sc", etc.
      required: [true, "Level is required"],
      trim: true,
    },
    targetLevel: {
      type: String, 
      enum: ["After 10th", "After 12th"],
      required: [true, "Target level (10th/12th) is required"],
    },
    category: {
      type: String, // "Medical", "Engineering", "Arts", etc.
      required: [true, "Category is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    
    // Detailed Content (Full Page)
    overview: { type: String, default: "" },
    admissionProcess: { type: String, default: "" },
    subjectsCovered: { type: [String], default: [] },
    skillsRequired: { type: [String], default: [] },
    careerScope: { type: String, default: "" },
    jobRoles: { type: [String], default: [] },
    salaryRange: {
      starting: { type: String, default: "" },
      growth: { type: String, default: "" }
    },
    higherStudies: { type: String, default: "" },
    workSectors: { type: [String], default: [] },
    advantages: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    studentNote: { type: String, default: "" },
    faqs: [faqSchema],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to create slug
courseSchema.pre("save", function () {
  if (this.courseName && !this.slug) {
    this.slug = this.courseName
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substr(2, 5);
  }
});

module.exports = mongoose.model("Course", courseSchema);

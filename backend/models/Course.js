const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: {
        values: ["10th", "12th", "Diploma", "Undergraduate"],
        message: "Level must be one of: 10th, 12th, Diploma, Undergraduate"
      },
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Medical", "Engineering", "Science", "Commerce", "Arts", 
          "Architecture", "Polytechnic", "ITI", "Design", "IT & Computer", 
          "Paramedical", "Agriculture", "Hotel Management", "Media & Journalism", 
          "Law", "Education", "Aviation"
        ],
        message: "Invalid category selected"
      },
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
    futureScope: {
      type: String,
      required: [true, "Future scope is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);

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
        values: ["5th", "8th", "10th", "12th"],
        message: "Level must be one of: 5th, 8th, 10th, 12th"
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

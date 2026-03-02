const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },
    conductingBody: {
      type: String,
      required: [true, "Conducting body is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: {
        values: ["8th", "10th", "12th", "Graduate"],
        message: "Level must be one of: 8th, 10th, 12th, Graduate"
      },
      trim: true,
    },
    importantDate: {
      type: String,
      required: [true, "Important date is required"],
      trim: true,
    },
    applicationLink: {
      type: String,
      trim: true,
    },
    officialWebsite: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);

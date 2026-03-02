const mongoose = require("mongoose");

const careerPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    ageGroup: {
      type: String,
      required: [true, "Age group is required"],
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
    careerDirections: {
      type: [String],
      required: [true, "Career directions are required"],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0;
        },
        message: "At least one career direction is required"
      }
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("CareerPath", careerPathSchema);

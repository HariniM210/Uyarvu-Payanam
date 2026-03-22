const mongoose = require("mongoose");

const careerPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Class level is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    sections: {
      type: [{
        heading: { type: String, trim: true },
        content: { type: String, trim: true },
        images: { type: [String], default: [] },
        videoUrl: { type: String, trim: true },
      }],
      default: [],
    },
    roadmap: {
      type: [String],
      default: [],
    },
    relatedCourses: {
      type: [String],
      default: [],
    },
    futureOpportunities: {
      type: [String],
      default: [],
    },
    interestArea: {
      type: String,
      enum: {
        values: ["Science", "Arts", "Commerce", "General", "Technology", "Vocational"],
        message: "Interest area must be one of: Science, Arts, Commerce, General, Technology, Vocational",
      },
      default: "General",
      trim: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    ageGroup: {
      type: String,
      default: "",
      trim: true,
    },
    careerDirections: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerPath", careerPathSchema);

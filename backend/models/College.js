const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      unique: true,
    },
    collegeCode: {
      type: String,
      trim: true,
      index: true,
    },
    stream: {
      type: String,
      required: [true, "Stream is required"],
      enum: {
        values: [
          "Engineering",
          "Medical",
          "Arts & Science",
          "Law",
          "Polytechnic",
          "Agriculture",
          "Others",
        ],
        message:
          "Stream must be one of: Engineering, Medical, Arts & Science, Law, Polytechnic, Agriculture, Others",
      },
      trim: true,
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "Tamil Nadu",
    },
    feesPerYear: {
      type: Number,
      default: 0,
    },
    placementPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    rank: {
      type: String,
      trim: true,
      default: "",
    },
    accreditation: {
      type: String,
      trim: true,
      default: "",
    },
    coursesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }
    ],
    website: {
      type: String,
      trim: true,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

// Index for fast stream filtering, district filtering, and text search
collegeSchema.index({ stream: 1 });
collegeSchema.index({ district: 1 });
collegeSchema.index({ collegeName: "text", location: "text" });

module.exports = mongoose.model("College", collegeSchema);

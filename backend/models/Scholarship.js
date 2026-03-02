const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    eligibility: { type: String },
    deadline: { type: Date },
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);

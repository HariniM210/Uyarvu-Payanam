const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: { type: String },
    provider: { type: String },
    eligibility: { type: String },
    amount: { type: String },
    applicationLink: { type: String },
  },
  { collection: "scholarships", timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);

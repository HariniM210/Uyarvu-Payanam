const mongoose = require("mongoose");

const scholarshipApplicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    scholarshipName: { type: String, required: true },
    scholarshipProvider: { type: String },
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }
  },
  { collection: "scholarshipApplications", timestamps: true }
);

module.exports = mongoose.model("ScholarshipApplication", scholarshipApplicationSchema);

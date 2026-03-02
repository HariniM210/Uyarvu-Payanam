const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);

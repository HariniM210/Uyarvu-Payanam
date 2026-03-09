const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    twoFactorAuth: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    studentRegistration: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    analyticsTracking: { type: Boolean, default: true },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

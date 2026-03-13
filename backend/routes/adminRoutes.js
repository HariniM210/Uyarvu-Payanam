const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const {
  loginAdmin,
  dashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  resetPassword,
  deleteUser,
  changePassword,
  createSubAdmin,
  getSubAdmins,
  deleteSubAdmin,
} = require("../controllers/adminController");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/dashboard", verifyAdmin, dashboardStats);

// User management
router.get("/users", verifyAdmin, getUsers);
router.patch("/users/:id/block", verifyAdmin, blockUser);
router.patch("/users/:id/unblock", verifyAdmin, unblockUser);
router.put("/users/:id/reset-password", verifyAdmin, resetPassword);
router.delete("/users/:id", verifyAdmin, deleteUser);

// Admin features
router.put("/change-password", verifyAdmin, changePassword);
router.post("/create-subadmin", verifyAdmin, createSubAdmin);
router.get("/subadmins", verifyAdmin, getSubAdmins);
router.delete("/subadmin/:id", verifyAdmin, deleteSubAdmin);

// TEMPORARY ROUTE TO CREATE ADMIN
router.get("/create-admin", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: "uyarvupayanam@gmail.com" });

    if (existingAdmin) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new Admin({
      email: "uyarvupayanam@gmail.com",
      password: hashedPassword,
      role: "Admin",
    });

    await admin.save();

    res.json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

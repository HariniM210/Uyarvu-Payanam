const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin"); // make sure path is correct
const { loginAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", loginAdmin);

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
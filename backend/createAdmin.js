const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("./models/Admin");

dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "uyarvupayanam@gmail.com" });
    
    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    // Create admin
    const admin = new Admin({
      email: "uyarvupayanam@gmail.com",
      password: hashedPassword
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email:    uyarvupayanam@gmail.com");
    console.log("Password: Admin@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();

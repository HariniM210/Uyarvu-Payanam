const Admin = require("../models/Admin");
const User = require("../models/User");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const Scholarship = require("../models/Scholarship");
const Activity = require("../models/Activity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    // 1. Total students
    const totalStudents = await User.countDocuments({ role: "student" });

    // 2. Active courses count
    const activeCourses = await Course.countDocuments();

    // 3. Exams count
    const examsCount = await Exam.countDocuments();

    // 4. Scholarships count
    const scholarshipsCount = await Scholarship.countDocuments();

    // 5. Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await User.aggregate([
      { $match: { role: "student", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const registrationData = monthlyRegistrations.map((item) => ({
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    // 6. Level distribution (percentage)
    const levelAgg = await User.aggregate([
      { $match: { role: "student", classLevel: { $exists: true, $ne: null } } },
      { $group: { _id: "$classLevel", count: { $sum: 1 } } },
    ]);

    const totalWithLevel = levelAgg.reduce((sum, l) => sum + l.count, 0);
    const levelDistribution = levelAgg.map((l) => ({
      level: l._id,
      percentage: totalWithLevel > 0 ? Math.round((l.count / totalWithLevel) * 100) : 0,
    }));

    // 7. Recent activities (latest 5)
    const recentActivities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 8. Popular careers (top 5)
    const popularCareers = await User.aggregate([
      { $match: { role: "student", selectedCareer: { $exists: true, $ne: null } } },
      { $group: { _id: "$selectedCareer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    res.json({
      totalStudents,
      activeCourses,
      examsCount,
      scholarshipsCount,
      monthlyRegistrations: registrationData,
      levelDistribution,
      recentActivities,
      popularCareers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// ── User Management ──

exports.getUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { role: "student" };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "blocked" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User blocked successfully", user });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User unblocked successfully", user });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ message: "Failed to unblock user" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Password reset successfully", user });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const matches = await bcrypt.compare(currentPassword, admin.password);
    if (!matches) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

exports.createSubAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions = {} } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await Admin.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Admin email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const subAdmin = await Admin.create({
      name: name || "Sub Admin",
      email: String(email).toLowerCase(),
      password: hashed,
      role: "sub_admin",
      permissions: {
        manageUsers: Boolean(permissions.manageUsers),
        manageSettings: Boolean(permissions.manageSettings),
        manageContent: Boolean(permissions.manageContent),
        manageNotifications: Boolean(permissions.manageNotifications),
        viewReports: Boolean(permissions.viewReports),
      },
      createdBy: req.admin._id,
      isActive: true,
    });

    return res.status(201).json({
      message: "Sub-admin created successfully",
      subAdmin: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role,
        permissions: subAdmin.permissions,
        isActive: subAdmin.isActive,
        createdAt: subAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create sub-admin error:", error);
    return res.status(500).json({ message: "Failed to create sub-admin" });
  }
};

exports.getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Admin.find({ role: "sub_admin" })
      .select("name email role permissions isActive createdAt createdBy")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ count: subAdmins.length, subAdmins });
  } catch (error) {
    console.error("Get sub-admins error:", error);
    return res.status(500).json({ message: "Failed to fetch sub-admins" });
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const subAdmin = await Admin.findOne({ _id: id, role: "sub_admin" });
    if (!subAdmin) {
      return res.status(404).json({ message: "Sub-admin not found" });
    }

    await Admin.deleteOne({ _id: id });

    return res.json({ message: "Sub-admin deleted successfully" });
  } catch (error) {
    console.error("Delete sub-admin error:", error);
    return res.status(500).json({ message: "Failed to delete sub-admin" });
  }
};

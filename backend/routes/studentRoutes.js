const express = require("express");
const router = express.Router();
const { registerStudent, loginStudent } = require("../controllers/studentController");
const verifyStudent = require("../middleware/verifyStudent");

// Public Auth routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected routes (Login required)
router.get("/profile", verifyStudent, (req, res) => {
    res.json({ message: "Protected profile data", student: req.student });
});

router.get("/recommendations", verifyStudent, (req, res) => {
    res.json({ message: "Protected personalized recommendations", student: req.student._id });
});

module.exports = router;

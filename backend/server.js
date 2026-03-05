const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/career-paths", require("./routes/careerPathRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/colleges", require("./routes/collegeRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// â”€â”€ Socket.io setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Store io on the app object so controllers can access it via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`ðŸ”Œ Socket connected: ${socket.id}`);

  // â”€â”€ Admin connection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Admin clients join the "admins" room for multi-tab state sync.
  // Admin does NOT join "students" or any "user_<id>" room.
  socket.on("join_admin", () => {
    socket.join("admins");
    console.log(`ðŸ” Admin socket ${socket.id} joined [admins] room`);
  });

  // â”€â”€ Student connection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Students emit "join_student" with their userId.
  // They join TWO rooms:
  //   1. "students"       â†’ shared room for broadcast notifications
  //   2. "user_<userId>"  â†’ personal room for targeted notifications
  // Admin clients do NOT call this event, so admin is NEVER in these rooms
  // and will NEVER receive user notification socket events.
  socket.on("join_student", (userId) => {
    socket.join("students");           // shared broadcast room
    socket.join(`user_${userId}`);     // personal room
    console.log(`ðŸŽ“ Student ${userId} joined rooms: students, user_${userId}`);
  });

  // Legacy support: if old client code calls join_user_room
  socket.on("join_user_room", (userId) => {
    socket.join("students");
    socket.join(`user_${userId}`);
    console.log(`ðŸ“Œ Socket ${socket.id} joined room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`ðŸ”Œ Socket disconnected: ${socket.id}`);
  });
});

// â”€â”€ Middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/career-paths", require("./routes/careerPathRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/colleges", require("./routes/collegeRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin/notifications", require("./routes/adminNotificationRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// â”€â”€ Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`ðŸš€ Server + Socket.io running on port ${PORT}`)
);

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./db/index.js");
const { connectDB, isMongoConnected } = db;

const authRoutes = require("./routes/auth");
const proposalsRoutes = require("./routes/proposals");
const waterUsageRoutes = require("./routes/waterUsage");
const usersRoutes = require("./routes/users");

const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.RENDER_EXTERNAL_URL || "http://localhost:4000"]
  : ["http://localhost:3000", "http://localhost:4000"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB (if available)
connectDB();

// In-memory fallback storage (moved to module)
const { inMemoryUsers, inMemoryProposals, inMemoryWaterUsage } = require("./storage/inMemory");

// Mount route modules
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/water-usage", waterUsageRoutes);
app.use("/api/users", usersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mongoConnected: isMongoConnected() });
});

// Serve frontend build (Create React App uses 'build' folder)
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// SPA catch-all route (must be after all API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${isMongoConnected() ? "Connected" : "Not connected (using in-memory storage)"}`);
  console.log(`📁 Frontend build path: ${frontendBuildPath}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  const fs = require("fs");
  if (!fs.existsSync(frontendBuildPath)) {
    console.warn(`⚠️  Frontend build folder not found at ${frontendBuildPath}`);
  } else {
    console.log(`✓ Frontend build folder exists`);
  }
});



const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// We bring in our database connection helpers
const db = require("./db/index.js");
const { connectDB, isMongoConnected } = db;

// Import our route handlers for different parts of the app
const authRoutes = require("./routes/auth");
const proposalsRoutes = require("./routes/proposals");
const waterUsageRoutes = require("./routes/waterUsage");
const usersRoutes = require("./routes/users");

// Import intelligent feature routes (predictive models, weather, analytics)
const weatherRoutes = require("./routes/weather");
const predictionRoutes = require("./routes/prediction");
const cropsRoutes = require("./routes/crops");
const analyticsRoutes = require("./routes/analytics");
const scheduleRoutes = require("./routes/schedule");

const app = express();

// Set up security so our frontend can talk to the backend safely
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000"
];

if (process.env.RENDER_EXTERNAL_URL) {
  allowedOrigins.push(process.env.RENDER_EXTERNAL_URL);
}

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Make sure we can read JSON data sent in requests
app.use(express.json());

// Kick off the database connection
connectDB();

// Pull in some temporary storage in case the database isn't ready
const { inMemoryUsers, inMemoryProposals, inMemoryWaterUsage } = require("./storage/inMemory");

// Connect all our specific feature routes to the main app
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/water-usage", waterUsageRoutes);
app.use("/api/users", usersRoutes);

// Connect intelligent feature routes — predictive irrigation, weather, crop advisor, analytics
app.use("/api/weather", weatherRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/crops", cropsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schedule", scheduleRoutes);

// A simple way to check if the server is healthy and if MongoDB is happy
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mongoConnected: isMongoConnected() });
});

// Help the server find the frontend files once they're built
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// For all other web requests, just send back the main frontend page
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Start listening for visitors on the designated port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${isMongoConnected() ? "Connected" : "Not connected (using in-memory storage)"}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  
  // Double check if the frontend files are actually there
  const fs = require("fs");
  if (!fs.existsSync(frontendBuildPath)) {
    console.warn(`⚠️  Frontend build folder not found at ${frontendBuildPath}`);
  } else {
    console.log(`✓ Frontend build folder exists`);
  }
});



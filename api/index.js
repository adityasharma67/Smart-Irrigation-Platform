// Vercel serverless function wrapper for Express backend
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const db = require("../backend/db/index.js");
const { connectDB } = db;

// Import routes
const authRoutes = require("../backend/routes/auth");
const proposalsRoutes = require("../backend/routes/proposals");
const waterUsageRoutes = require("../backend/routes/waterUsage");
const usersRoutes = require("../backend/routes/users");

// Create Express app
const app = express();

// CORS configuration - allow requests from frontend domain
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now - tighten as needed
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect to MongoDB (if available)
connectDB();

// Mount route modules
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/water-usage", waterUsageRoutes);
app.use("/api/users", usersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    mongoConnected: db.isMongoConnected(),
    timestamp: new Date().toISOString()
  });
});

// Export as Vercel serverless function
module.exports = app;


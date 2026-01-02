const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/index.js");
const { connectDB, isMongoConnected } = db;

const authRoutes = require("./routes/auth");
const proposalsRoutes = require("./routes/proposals");
const waterUsageRoutes = require("./routes/waterUsage");
const usersRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${isMongoConnected() ? "Connected" : "Not connected (using in-memory storage)"}`);
});



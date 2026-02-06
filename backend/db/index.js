const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-irrigation";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("⚠️  MongoDB not available, using in-memory storage");
    console.log("   To use MongoDB, install it and set MONGODB_URI in .env");
  }
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isMongoConnected, mongoose };

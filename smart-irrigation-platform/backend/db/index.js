const mongoose = require("mongoose");
require("dotenv").config();

// This is the address where our main database lives
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-irrigation";

// This function attempts to wake up the database and establish a connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Database connected and ready to go!");
  } catch (err) {
    // If the database is sleeping or missing, we gracefully switch to using temporary in-memory storage
    console.log("⚠️  Could not connect to MongoDB. Using temporary in-memory storage for now.");
    console.log("   Tip: To save your data permanently, make sure MongoDB is running.");
  }
};

// A quick helper to tell the rest of the app if we're using the real database or the temporary one
const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isMongoConnected, mongoose };

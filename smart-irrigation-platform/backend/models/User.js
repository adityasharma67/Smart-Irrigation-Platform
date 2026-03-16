const mongoose = require("mongoose");

// This defines what information we store for every person using the platform
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Roles help us tailor the experience (Farmer, Service Provider, or Manufacturer)
  role: { type: String, enum: ["farmer", "provider", "manufacturer"], default: "farmer" },
  location: String,
  cropType: String,
}, { timestamps: true }); // Automatically record when the user joined and when they last updated their profile

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

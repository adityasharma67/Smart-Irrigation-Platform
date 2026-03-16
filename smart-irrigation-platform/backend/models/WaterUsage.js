const mongoose = require("mongoose");

// This helps farmers track how much water they are using in their fields
const waterUsageSchema = new mongoose.Schema({
  // The specific field or patch of land being monitored
  field: { type: String, required: true },
  // Total liters of water consumed
  litersUsed: { type: Number, required: true },
  // Status helps farmers quickly see if usage is healthy (Optimal, High, or Low)
  status: { type: String, enum: ["Optimal", "High", "Low"], default: "Optimal" },
  // Which farmer this specific record belongs to
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true }); // Automatically record when the water data was added

module.exports = mongoose.models.WaterUsage || mongoose.model("WaterUsage", waterUsageSchema);

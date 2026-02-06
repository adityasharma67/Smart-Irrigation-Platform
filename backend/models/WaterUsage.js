const mongoose = require("mongoose");

const waterUsageSchema = new mongoose.Schema({
  field: { type: String, required: true },
  litersUsed: { type: Number, required: true },
  status: { type: String, enum: ["Optimal", "High", "Low"], default: "Optimal" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.models.WaterUsage || mongoose.model("WaterUsage", waterUsageSchema);

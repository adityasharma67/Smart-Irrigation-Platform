const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", index: true },
  type: {
    type: String,
    enum: ["low_moisture", "bad_weather", "pest_risk", "overdue_task", "system"],
    required: true,
  },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: ["active", "acknowledged", "resolved"], default: "active" },
  actionable: { type: Boolean, default: true },
  resolvedAt: Date,
}, { timestamps: true });

alertSchema.index({ farmId: 1, status: 1, severity: -1 });

module.exports = mongoose.models.Alert || mongoose.model("Alert", alertSchema);

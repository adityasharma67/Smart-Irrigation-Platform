const mongoose = require("mongoose");

const analyticsRecordSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", index: true },
  recordedOn: { type: Date, required: true, default: Date.now, index: true },
  yieldKg: { type: Number, min: 0 },
  expenseAmount: { type: Number, min: 0 },
  revenueAmount: { type: Number, min: 0 },
  waterUsedLiters: { type: Number, min: 0 },
  moistureAverage: { type: Number, min: 0, max: 100 },
  performanceScore: { type: Number, min: 0, max: 100 },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

analyticsRecordSchema.index({ farmId: 1, recordedOn: -1 });

module.exports = mongoose.models.AnalyticsRecord || mongoose.model("AnalyticsRecord", analyticsRecordSchema);

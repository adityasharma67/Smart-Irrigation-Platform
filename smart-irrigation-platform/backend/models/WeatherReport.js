const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
  date: Date,
  condition: String,
  highC: Number,
  lowC: Number,
  rainChance: { type: Number, min: 0, max: 100 },
  rainfallMm: { type: Number, min: 0 },
}, { _id: false });

const weatherReportSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  location: String,
  observedAt: { type: Date, default: Date.now, index: true },
  condition: String,
  temperatureC: Number,
  humidity: { type: Number, min: 0, max: 100 },
  rainfallMm: { type: Number, min: 0 },
  rainChance: { type: Number, min: 0, max: 100 },
  windKph: { type: Number, min: 0 },
  alertLevel: { type: String, enum: ["none", "watch", "warning", "critical"], default: "none" },
  forecast: [forecastSchema],
}, { timestamps: true });

weatherReportSchema.index({ farmId: 1, observedAt: -1 });

module.exports = mongoose.models.WeatherReport || mongoose.model("WeatherReport", weatherReportSchema);

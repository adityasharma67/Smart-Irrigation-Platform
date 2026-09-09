const mongoose = require("mongoose");

const soilReadingSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", index: true },
  moisture: { type: Number, required: true, min: 0, max: 100 },
  ph: { type: Number, min: 0, max: 14 },
  temperatureC: Number,
  nitrogen: { type: Number, min: 0 },
  phosphorus: { type: Number, min: 0 },
  potassium: { type: Number, min: 0 },
  electricalConductivity: { type: Number, min: 0 },
  source: { type: String, enum: ["sensor", "manual", "import"], default: "sensor" },
  recordedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

soilReadingSchema.index({ farmId: 1, recordedAt: -1 });

module.exports = mongoose.models.SoilReading || mongoose.model("SoilReading", soilReadingSchema);

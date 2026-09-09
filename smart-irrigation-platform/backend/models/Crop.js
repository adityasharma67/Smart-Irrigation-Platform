const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  variety: { type: String, trim: true, maxlength: 100 },
  areaHectares: { type: Number, min: 0, default: 0 },
  plantedOn: Date,
  expectedHarvestDate: Date,
  growthStage: {
    type: String,
    enum: ["planned", "germination", "vegetative", "flowering", "fruiting", "harvest-ready", "harvested"],
    default: "planned",
  },
  health: { type: String, enum: ["excellent", "good", "watch", "at-risk"], default: "good" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  estimatedYieldKg: { type: Number, min: 0 },
  notes: { type: String, maxlength: 2000 },
}, { timestamps: true });

cropSchema.index({ farmId: 1, expectedHarvestDate: 1 });

module.exports = mongoose.models.Crop || mongoose.model("Crop", cropSchema);

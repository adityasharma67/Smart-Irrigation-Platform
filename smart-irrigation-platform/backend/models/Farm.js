const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  location: {
    address: { type: String, trim: true },
    latitude: Number,
    longitude: Number,
  },
  sizeHectares: { type: Number, min: 0, default: 0 },
  soilType: { type: String, default: "loam" },
  status: { type: String, enum: ["active", "inactive", "archived"], default: "active" },
  imageUrl: String,
  tags: [String],
  settings: {
    timezone: { type: String, default: "Asia/Kolkata" },
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
  },
}, { timestamps: true });

farmSchema.index({ ownerId: 1, status: 1 });

module.exports = mongoose.models.Farm || mongoose.model("Farm", farmSchema);

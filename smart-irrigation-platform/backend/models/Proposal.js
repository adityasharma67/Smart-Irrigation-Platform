const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  targetCrops: [String],
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);

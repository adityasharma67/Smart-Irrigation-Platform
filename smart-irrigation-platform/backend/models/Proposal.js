const mongoose = require("mongoose");

// This represents a service offer created by a provider or manufacturer
const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  // The cost for the irrigation solution or equipment
  price: { type: Number, required: true },
  // Which specific crops this irrigation plan is best suited for
  targetCrops: [String],
  // Keeps track of who created this proposal
  proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
}, { timestamps: true }); // Automatically track when the proposal was made and last edited

module.exports = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);

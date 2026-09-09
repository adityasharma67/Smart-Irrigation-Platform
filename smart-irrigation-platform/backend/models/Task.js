const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true, index: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  type: { type: String, enum: ["planting", "spraying", "watering", "harvesting", "inspection", "other"], default: "other" },
  dueDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ["todo", "in_progress", "completed", "overdue"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  assignedTo: String,
  reminderAt: Date,
  notes: { type: String, maxlength: 2000 },
}, { timestamps: true });

taskSchema.index({ farmId: 1, status: 1, dueDate: 1 });

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);

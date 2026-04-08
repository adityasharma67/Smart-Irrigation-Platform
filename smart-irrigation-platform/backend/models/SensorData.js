const mongoose = require("mongoose");

// Stores IoT sensor readings from field monitoring equipment
const sensorDataSchema = new mongoose.Schema({
  fieldId: { type: String, required: true, index: true },
  cropType: String,
  soilMoisture: { type: Number },       // percentage (0-100)
  temperature: { type: Number },         // °C
  humidity: { type: Number },            // percentage
  lightIntensity: { type: Number },      // lux
  soilPH: { type: Number },             // pH scale (0-14)
  rainfall: { type: Number, default: 0 }, // mm
  batteryLevel: { type: Number },        // percentage
  anomaly: { type: Boolean, default: false },
  anomalyType: { type: String, enum: ["sensor_spike", "sensor_dropout", null], default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Index for efficient time-series queries
sensorDataSchema.index({ fieldId: 1, createdAt: -1 });

module.exports = mongoose.models.SensorData || mongoose.model("SensorData", sensorDataSchema);

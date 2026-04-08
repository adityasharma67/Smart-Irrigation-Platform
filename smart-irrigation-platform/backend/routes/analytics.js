const express = require("express");
const router = express.Router();
const { generateSensorData, generateSensorSummary } = require("../services/sensorSimulator");
const { descriptiveStatistics, detectAnomalies, analyzeTrends, calculateEfficiency, generateSavingsReport } = require("../services/analytics");
const { analyzeSensorData } = require("../services/prediction");

// Returns simulated sensor data with complete statistical analysis for a field
router.get("/sensor-data/:fieldId", (req, res) => {
  try {
    const { cropType, days, soilType, season } = req.query;
    
    const sensorData = generateSensorData({
      fieldId: req.params.fieldId,
      cropType: cropType || "wheat",
      days: parseInt(days) || 30,
      readingsPerDay: 4,
      soilType: soilType || "loam",
      season: season || null,
    });

    const summary = generateSensorSummary(sensorData);
    const mlAnalysis = analyzeSensorData(sensorData);
    
    // Statistical analysis on soil moisture
    const moistureValues = sensorData.map(d => d.soilMoisture);
    const moistureStats = descriptiveStatistics(moistureValues);
    const anomalies = detectAnomalies(moistureValues);
    
    // Trend analysis
    const trendData = analyzeTrends(moistureValues);

    res.json({
      fieldId: req.params.fieldId,
      dataPoints: sensorData.length,
      data: sensorData,
      summary,
      statistics: moistureStats,
      anomalies: {
        count: anomalies.length,
        details: anomalies,
      },
      trends: trendData,
      mlAnalysis,
    });
  } catch (error) {
    console.error("Error generating sensor data:", error);
    res.status(500).json({ message: "Could not generate sensor data", error: error.message });
  }
});

// Returns water usage efficiency report for a user
router.get("/efficiency/:userId", (req, res) => {
  try {
    const { actualUsage, recommendedUsage, rainfall, area } = req.query;

    const efficiency = calculateEfficiency(
      parseFloat(actualUsage) || 5000,
      parseFloat(recommendedUsage) || 4500,
      parseFloat(rainfall) || 0,
      parseFloat(area) || 1
    );

    res.json(efficiency);
  } catch (error) {
    console.error("Error calculating efficiency:", error);
    res.status(500).json({ message: "Could not calculate efficiency", error: error.message });
  }
});

// Returns trend analysis for a specific field
router.get("/trends/:fieldId", (req, res) => {
  try {
    const { days, cropType, soilType } = req.query;

    // Generate sensor data for the field
    const sensorData = generateSensorData({
      fieldId: req.params.fieldId,
      cropType: cropType || "wheat",
      days: parseInt(days) || 30,
      readingsPerDay: 4,
      soilType: soilType || "loam",
    });

    const moistureValues = sensorData.map(d => d.soilMoisture);
    const tempValues = sensorData.map(d => d.temperature);
    
    res.json({
      fieldId: req.params.fieldId,
      moisture: {
        statistics: descriptiveStatistics(moistureValues),
        trends: analyzeTrends(moistureValues),
        anomalies: detectAnomalies(moistureValues),
      },
      temperature: {
        statistics: descriptiveStatistics(tempValues),
        trends: analyzeTrends(tempValues),
      },
      dataPoints: sensorData.length,
    });
  } catch (error) {
    console.error("Error analyzing trends:", error);
    res.status(500).json({ message: "Could not analyze trends", error: error.message });
  }
});

// Generates savings report comparing smart vs. traditional irrigation
router.get("/savings-report", (req, res) => {
  try {
    const { cropType, area, days } = req.query;
    
    // Generate sample usage history
    const numDays = parseInt(days) || 30;
    const usageHistory = Array.from({ length: numDays }, (_, i) => ({
      date: new Date(Date.now() - (numDays - i) * 86400000).toISOString(),
      litersUsed: 3000 + Math.sin(i * 0.3) * 1000 + Math.random() * 500,
    }));

    const report = generateSavingsReport(
      usageHistory,
      cropType || "wheat",
      parseFloat(area) || 1
    );

    res.json(report);
  } catch (error) {
    console.error("Error generating savings report:", error);
    res.status(500).json({ message: "Could not generate savings report", error: error.message });
  }
});

// Generates simulated sensor data for a field (on demand)
router.post("/simulate/:fieldId", (req, res) => {
  try {
    const { cropType, days, soilType, season } = req.body;
    
    const sensorData = generateSensorData({
      fieldId: req.params.fieldId,
      cropType: cropType || "wheat",
      days: parseInt(days) || 30,
      readingsPerDay: 4,
      soilType: soilType || "loam",
      season: season || null,
    });

    res.json({
      fieldId: req.params.fieldId,
      generated: sensorData.length,
      data: sensorData,
      summary: generateSensorSummary(sensorData),
    });
  } catch (error) {
    console.error("Error simulating sensor data:", error);
    res.status(500).json({ message: "Could not simulate sensor data", error: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { predictWaterNeeds, analyzeSensorData } = require("../services/prediction");
const { getCurrentWeather } = require("../services/weather");

// Predicts water needs for the next 7 days for a specific crop
router.get("/:cropType", async (req, res) => {
  try {
    const { soilType, area, plantingDate, location } = req.query;

    // Optionally fetch weather forecast if location provided
    let weatherForecast = null;
    if (location) {
      weatherForecast = await getCurrentWeather(location);
    }

    const prediction = predictWaterNeeds({
      cropType: req.params.cropType,
      soilType: soilType || "loam",
      areaHectares: parseFloat(area) || 1,
      plantingDate: plantingDate || null,
      weatherForecast,
    });

    res.json(prediction);
  } catch (error) {
    console.error("Error generating predictions:", error);
    res.status(500).json({ message: "Could not generate predictions", error: error.message });
  }
});

// Generates a personalized schedule based on user's crops and location
router.get("/schedule/:userId", async (req, res) => {
  try {
    const { cropType, location, soilType, area, plantingDate } = req.query;

    let weatherForecast = null;
    if (location) {
      weatherForecast = await getCurrentWeather(location);
    }

    // Generate sample historical data for the prediction engine
    const historicalUsage = Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (14 - i) * 86400000).toISOString(),
      litersUsed: 3000 + Math.sin(i * 0.5) * 800 + Math.random() * 400,
    }));

    const prediction = predictWaterNeeds({
      cropType: cropType || "wheat",
      historicalUsage,
      soilType: soilType || "loam",
      areaHectares: parseFloat(area) || 1,
      plantingDate: plantingDate || null,
      weatherForecast,
    });

    res.json(prediction);
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ message: "Could not generate schedule", error: error.message });
  }
});

// Analyzes uploaded sensor data and returns insights
router.post("/analyze", (req, res) => {
  try {
    const { sensorData } = req.body;

    if (!sensorData || !Array.isArray(sensorData) || sensorData.length < 5) {
      return res.status(400).json({ 
        message: "Please provide at least 5 sensor data points in the 'sensorData' array" 
      });
    }

    const analysis = analyzeSensorData(sensorData);
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing sensor data:", error);
    res.status(500).json({ message: "Could not analyze sensor data", error: error.message });
  }
});

module.exports = router;

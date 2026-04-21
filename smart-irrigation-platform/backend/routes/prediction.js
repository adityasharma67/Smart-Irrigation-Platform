const express = require("express");
const router = express.Router();
const { predictWaterNeeds, analyzeSensorData } = require("../services/prediction");
const { getCurrentWeather } = require("../services/weather");

// Predicts water needs for the next 7 days for a specific crop
router.get("/:cropType", async (req, res) => {
  try {
    const { soilType, area, plantingDate, location, lat, lon } = req.query;
    const requestedLocation = location || (lat && lon ? `${lat},${lon}` : null);

    // Optionally fetch weather forecast if location provided
    let weatherForecast = null;
    if (requestedLocation) {
      weatherForecast = await getCurrentWeather(requestedLocation);
    }

    const latitude = Number.isFinite(parseFloat(lat))
      ? parseFloat(lat)
      : (weatherForecast?.coordinates?.lat ?? 20);

    const prediction = predictWaterNeeds({
      cropType: req.params.cropType,
      soilType: soilType || "loam",
      areaHectares: parseFloat(area) || 1,
      plantingDate: plantingDate || null,
      weatherForecast,
      latitude,
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
    const { cropType, location, soilType, area, plantingDate, lat, lon } = req.query;
    const requestedLocation = location || (lat && lon ? `${lat},${lon}` : null);

    let weatherForecast = null;
    if (requestedLocation) {
      weatherForecast = await getCurrentWeather(requestedLocation);
    }

    const latitude = Number.isFinite(parseFloat(lat))
      ? parseFloat(lat)
      : (weatherForecast?.coordinates?.lat ?? 20);

    // Use persisted history when available; keep empty instead of random synthetic values
    const historicalUsage = [];

    const prediction = predictWaterNeeds({
      cropType: cropType || "wheat",
      historicalUsage,
      soilType: soilType || "loam",
      areaHectares: parseFloat(area) || 1,
      plantingDate: plantingDate || null,
      weatherForecast,
      latitude,
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

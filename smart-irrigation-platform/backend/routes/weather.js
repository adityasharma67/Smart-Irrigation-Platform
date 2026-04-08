const express = require("express");
const router = express.Router();
const { getCurrentWeather, calculateIrrigationImpact } = require("../services/weather");

// Returns current weather and 5-day forecast for a location
router.get("/:location", async (req, res) => {
  try {
    const weather = await getCurrentWeather(req.params.location);
    res.json(weather);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ message: "Could not fetch weather data", error: error.message });
  }
});

// Returns how current weather affects irrigation needs
router.get("/:location/irrigation-impact", async (req, res) => {
  try {
    const weather = await getCurrentWeather(req.params.location);
    const impact = calculateIrrigationImpact(weather);
    res.json({
      weather: weather.current,
      forecast: weather.forecast,
      irrigationImpact: impact,
      source: weather.source,
    });
  } catch (error) {
    console.error("Error calculating irrigation impact:", error);
    res.status(500).json({ message: "Could not calculate irrigation impact", error: error.message });
  }
});

module.exports = router;
